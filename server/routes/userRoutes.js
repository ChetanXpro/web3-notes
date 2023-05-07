import { Router } from "express";

const router = Router();
import userController from "../controllers/userController.js";
import verifyJWT from "../middleware/verifyJWT.js";

// router.use(verifyJWT);

router.post("/", userController.createNewUser);
router.get("/getUser", verifyJWT, userController.getUserById);

export default router;
