import { Router } from "express";

const router = Router();
import { addAdmin, createNotes } from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.post("/addnote", verifyJWT, verifyAdmin, createNotes);
router.post("/addadmin", addAdmin);

export default router;
