import { Router } from "express";
import { changeUserPassword, deleteAccount, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserAvatarImage, updateUserDetails, verifyEmail, googleLogin, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/auth/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/auth/login").post(
    loginUser
)


router.route("/auth/logout").post(
    verifyJWT,
    logoutUser
)

router.route("/auth/refreshToken").post(
    refreshAccessToken
)

router.route("/auth/changePassword").patch(
    verifyJWT,
    changeUserPassword
)

router.route("/auth/userDetails").get(
    verifyJWT,
    getCurrentUser
)

router.route("/auth/updateUserDetails").patch(
    verifyJWT,
    updateUserDetails
)

router.route("/auth/updateImageFiles").patch(
    verifyJWT,
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    updateUserAvatarImage
)

router.route("/auth/verify-email").post(
    verifyEmail
);

router.route("/auth/deleteAccount").delete(
    verifyJWT,
    deleteAccount
)

router.route("/auth/google-login").post(
    googleLogin
);

router.route("/auth/forgotPassword").post(
    forgotPassword
);

router.route("/auth/resetPassword").post(
    resetPassword
);
export default router