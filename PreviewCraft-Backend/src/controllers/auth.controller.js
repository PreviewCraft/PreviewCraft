import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.auth.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import crypto from "crypto";
import { Resend } from 'resend';
import { sendVerificationEmail, sendResetPasswordEmail } from "../services/email.services.js";
import { verifyGoogleToken } from "../services/google.services.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return {
            refreshToken,
            accessToken,
        }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    let avatar;
    if (avatarLocalPath) avatar = await uploadOnCloudinary(avatarLocalPath);

    const user = await User.create({
        fullname,
        avatar: avatar?.secure_url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const otp = crypto.randomInt(100000, 1000000).toString();

    const hashedOtp = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    user.emailVerificationToken = hashedOtp;

    user.emailVerificationExpiry = new Date(
        Date.now() + 10 * 60 * 1000
    );

    await user.save({
        validateBeforeSave: false,
    });

    await sendVerificationEmail(user.email, otp);

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }



    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

const verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(
            400,
            "Email and verification code are required"
        );
    }

    const hashedOtp = crypto
        .createHash("sha256")
        .update(String(otp).trim())
        .digest("hex");

    const user = await User.findOne({
        email: email.toLowerCase().trim(),
        emailVerificationToken: hashedOtp,
        emailVerificationExpiry: {
            $gt: new Date(),
        },
    });

    if (!user) {
        throw new ApiError(
            400,
            "Invalid or expired verification code"
        );
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save({
        validateBeforeSave: false,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Email verified successfully"
        )
    );
});

const resendVerificationOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({
        email: email.toLowerCase().trim(),
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isEmailVerified) {
        throw new ApiError(400, "Email is already verified");
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    const hashedOtp = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    user.emailVerificationToken = hashedOtp;
    user.emailVerificationExpiry = new Date(
        Date.now() + 10 * 60 * 1000
    );

    await user.save({
        validateBeforeSave: false,
    });

    await sendVerificationEmail(user.email, otp);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "A new verification code has been sent"
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body
    if (!username && !email) throw new ApiError(400, "username or email is required")
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) throw new ApiError(404, "User not found")
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) throw new ApiError(401, "Password is incorrect")
    if (!user.isEmailVerified) {
        throw new ApiError(
            401,
            "Please verify your email first."
        );
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(
            200, {
            user: loggedInUser, accessToken, refreshToken
        },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true
    }
    )
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken ?? req.body?.refreshToken
    if (!incomingRefreshToken) throw new ApiError(401, "unauthorized request")
    try {
        const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken._id);
        if (!user) throw new ApiError(401, "Invalid refresh token")
        if (incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "Refresh token is expired or used")
        const options = {
            httpOnly: true,
            secure: true,
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confNewPassword } = req.body
    if (!(newPassword === confNewPassword)) throw new ApiError(400, "New passwords doesn't match")
    const user = await User.findOne(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password")
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed succesfully")
    )

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully")
    )
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { username, email, fullname } = req.body
    if (!username && !email && !fullname) throw new ApiError(400, "All the fields are empty")
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email,
                username
            }
        },
        {
            new: true
        }
    ).select("-password")
    return res.status(200).json(
        new ApiResponse(200, user, "Account details updated successfully")
    )
})

const updateUserAvatarImage = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(
            400,
            "Please provide avatar image"
        );
    }
    let avatar;
    if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath);
    }
    if (avatarLocalPath && !avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }
    const updateData = {};
    if (avatar) {
        updateData.avatar = avatar.url;
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id, {
        $set: updateData
    }, {
        new: true
    }
    ).select("-password")
    return res.status(200).json(
        new ApiResponse(200, user, "File updated successfully")
    )
})

const deleteAccount = asyncHandler(async (req, res) => {

    const { password } = req.body;

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid password");
    }

    await User.findByIdAndDelete(user._id);

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "Account deleted successfully"
            )
        );

});

const googleLogin = asyncHandler(async (req, res) => {

    const { idToken } = req.body;

    if (!idToken) {
        throw new ApiError(400, "Google ID Token is required");
    }

    const googleUser = await verifyGoogleToken(idToken);

    let user = await User.findOne({
        email: googleUser.email
    });

    if (!user) {
        const baseUsername = googleUser.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "");

        let username = baseUsername;
        let counter = 1;
        while (await User.exists({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
        }
        user = await User.create({
            fullname: googleUser.fullname,
            username,
            email: googleUser.email.toLowerCase(),
            avatar: googleUser.avatar,
            googleId: googleUser.googleId,
            provider: "google",
            isEmailVerified: true,
        });
    }

    else {

        if (!user.googleId) {

            user.googleId = googleUser.googleId;

            user.provider = "google";

            user.isEmailVerified = true;

            await user.save({ validateBeforeSave: false });

        }

    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
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
                    refreshToken
                },
                "Google login successful"
            )
        );

});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
        email: normalizedEmail,
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    const hashedOtp = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

    user.passwordResetOtp = hashedOtp;
    user.passwordResetExpiry = new Date(
        Date.now() + 10 * 60 * 1000
    );

    await user.save({
        validateBeforeSave: false,
    });

    try {
        await sendResetPasswordEmail(
            user.email,
            otp
        );
    } catch (error) {
        user.passwordResetOtp = undefined;
        user.passwordResetExpiry = undefined;

        await user.save({
            validateBeforeSave: false,
        });

        throw new ApiError(
            500,
            "Failed to send password reset code"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password reset code sent to your email."
        )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
    console.log("BODY:", req.body);

    const {
        email,
        otp,
        password,
        confirmPassword,
    } = req.body || {};

    if (!email || !otp || !password || !confirmPassword) {
        throw new ApiError(
            400,
            "Email, OTP, password and confirm password are required"
        );
    }

    if (password !== confirmPassword) {
        throw new ApiError(
            400,
            "Passwords do not match"
        );
    }

    const hashedOtp = crypto
        .createHash("sha256")
        .update(String(otp).trim())
        .digest("hex");

    const user = await User.findOne({
        email: email.trim().toLowerCase(),

        passwordResetOtp: hashedOtp,

        passwordResetExpiry: {
            $gt: new Date(),
        },
    });

    if (!user) {
        throw new ApiError(
            400,
            "Invalid or expired reset code"
        );
    }

    user.password = password;

    user.passwordResetOtp = undefined;
    user.passwordResetExpiry = undefined;

    // Remove old field left from token-based reset implementation
    user.passwordResetToken = undefined;

    // Optional but recommended: invalidate existing sessions
    user.refreshToken = undefined;

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Password reset successful"
        )
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    updateUserDetails,
    updateUserAvatarImage,
    getCurrentUser,
    verifyEmail,
    deleteAccount,
    googleLogin,
    forgotPassword,
    resetPassword,
    generateAccessAndRefreshToken,
    resendVerificationOtp
}