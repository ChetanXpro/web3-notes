import { Router } from "express";

const router = Router();
import authController from "../controllers/authController.js";

// router.route("/").post(authController.login);
router.route("/wallet").post(authController.walletLogin);

export default router;
