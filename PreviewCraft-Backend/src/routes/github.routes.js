import { Router } from "express";

import {
    startGithubAuth,
    githubCallback,
} from "../controllers/github.controller.js";
const router = Router();

router.get(
    "/github",
    startGithubAuth
);

router.get(
    "/github/callback",
    githubCallback
);


export default router;