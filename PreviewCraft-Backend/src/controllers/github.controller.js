import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.auth.models.js";
import { generateAccessAndRefreshToken } from "./auth.controller.js";


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};


// ===============================
// START GITHUB OAUTH
// ===============================

const startGithubAuth = asyncHandler(async (req, res) => {
    const state = crypto.randomBytes(32).toString("hex");

    res.cookie("github_oauth_state", state, {
        ...cookieOptions,
        maxAge: 10 * 60 * 1000,
    });

    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
        state,
        scope: "read:user user:email",
    });

    return res.redirect(
        `https://github.com/login/oauth/authorize?${params.toString()}`
    );
});


// ===============================
// GITHUB CALLBACK
// ===============================

const githubCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies?.github_oauth_state;

    if (!code) {
        throw new ApiError(400, "GitHub authorization code is missing");
    }

    if (!state || !storedState || state !== storedState) {
        throw new ApiError(403, "Invalid GitHub OAuth state");
    }

    res.clearCookie("github_oauth_state", cookieOptions);


    // 1. Exchange authorization code for GitHub access token

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
            tokenData.error_description ||
            "Failed to authenticate with GitHub"
        );
    }

    const githubAccessToken = tokenData.access_token;


    // 2. Fetch GitHub profile

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
        throw new ApiError(401, "Failed to fetch GitHub user");
    }

    const githubUser = await userResponse.json();


    // 3. GitHub may not expose email on /user
    // So fetch verified emails separately if necessary

    let githubEmail = githubUser.email;

    if (!githubEmail) {
        const emailResponse = await fetch(
            "https://api.github.com/user/emails",
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Bearer ${githubAccessToken}`,
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            }
        );

        if (emailResponse.ok) {
            const emails = await emailResponse.json();

            const primaryEmail =
                emails.find(
                    (email) =>
                        email.primary &&
                        email.verified
                ) ||
                emails.find(
                    (email) => email.verified
                );

            githubEmail = primaryEmail?.email;
        }
    }

    if (!githubEmail) {
        throw new ApiError(
            400,
            "No verified email found on your GitHub account"
        );
    }

    githubEmail = githubEmail.toLowerCase();


    // 4. Find existing GitHub-linked account

    let user = await User.findOne({
        githubId: String(githubUser.id),
    });


    // 5. No GitHub link yet — check email

    if (!user) {
        user = await User.findOne({
            email: githubEmail,
        });

        if (user) {
            // Existing PreviewCraft user → link GitHub

            user.githubId = String(githubUser.id);
            user.githubUsername = githubUser.login;

            if (!user.avatar) {
                user.avatar = githubUser.avatar_url;
            }

            await user.save({
                validateBeforeSave: false,
            });
        } else {
            // Completely new GitHub user

            user = await User.create({
                fullname:
                    githubUser.name ||
                    githubUser.login,

                email: githubEmail,

                username:
                    githubUser.login.toLowerCase(),

                avatar:
                    githubUser.avatar_url,

                githubId:
                    String(githubUser.id),

                githubUsername:
                    githubUser.login,

                provider: "github",

                isEmailVerified: true,
            });
        }
    }


    // 6. Generate PreviewCraft JWTs

    const {
        accessToken,
        refreshToken,
    } = await generateAccessAndRefreshToken(user._id);


    // 7. Store JWTs in cookies and redirect

    return res
        .cookie(
            "accessToken",
            accessToken,
            cookieOptions
        )
        .cookie(
            "refreshToken",
            refreshToken,
            cookieOptions
        )
        .redirect(
            `${process.env.FRONTEND_URL}/home-previewcraft`
        );
});


export {
    startGithubAuth,
    githubCallback,
};