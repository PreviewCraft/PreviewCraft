import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.auth.models.js";
import { generateAccessAndRefreshToken } from "./auth.controller.js";


const startGithubAuth = asyncHandler(async (req, res) => {
    const state = crypto.randomBytes(32).toString("hex");

    res.cookie("github_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 60 * 1000,
    });

    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
        state,
    });

    return res.redirect(
        `https://github.com/login/oauth/authorize?${params.toString()}`
    );
});


const githubCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies.github_oauth_state;

    if (!code) {
        throw new ApiError(
            400,
            "GitHub authorization code is missing"
        );
    }

    if (!state || !storedState || state !== storedState) {
        throw new ApiError(
            403,
            "Invalid GitHub OAuth state"
        );
    }

    res.clearCookie("github_oauth_state", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
            method: "POST",

            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: process.env.GITHUB_CALLBACK_URL,
            }),
        }
    );

    const tokenData = await tokenResponse.json();

    if (
        !tokenResponse.ok ||
        tokenData.error ||
        !tokenData.access_token
    ) {
        throw new ApiError(
            401,
            "Failed to authenticate with GitHub"
        );
    }

    const githubAccessToken = tokenData.access_token;

    const userResponse = await fetch(
        "https://api.github.com/user",
        {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${githubAccessToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
            },
        }
    );

    if (!userResponse.ok) {
        throw new ApiError(
            401,
            "Failed to fetch GitHub user"
        );
    }

    const githubUser = await userResponse.json();

    let user = await User.findOne({
        githubId: String(githubUser.id),
    });

    if (!user) {
        if (githubUser.email) {
            user = await User.findOne({
                email: githubUser.email.toLowerCase(),
            });
        }
        if (user) {
            user.githubId = String(githubUser.id);
            user.githubUsername = githubUser.login;
            if (!user.avatar) {
                user.avatar = githubUser.avatar_url;
            }

            await user.save({
                validateBeforeSave: false,
            });
        }

        else {
            if (!githubUser.email) {
                throw new ApiError(
                    400,
                    "GitHub account does not provide an email address"
                );
            }

            user = await User.create({
                fullname:
                    githubUser.name ||
                    githubUser.login,

                email:
                    githubUser.email.toLowerCase(),

                username:
                    githubUser.login.toLowerCase(),

                avatar:
                    githubUser.avatar_url,

                githubId:
                    String(githubUser.id),

                githubUsername:
                    githubUser.login,

                provider:
                    "github",

                isEmailVerified:
                    true,
            });
        }
    }

    const {
        accessToken,
        refreshToken,
    } = await generateAccessAndRefreshToken(user._id);


    const loggedInUser = await User
        .findById(user._id)
        .select("-password -refreshToken");


    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    };


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "GitHub login successful"
            )
        );
});


export {
    startGithubAuth,
    githubCallback,
};