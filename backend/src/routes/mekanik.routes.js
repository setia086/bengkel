import express from "express";
import * as mekanikController from "../controllers/mekanik.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, mekanikController.getAll);
router.get("/:id", verifyToken, mekanikController.getById);
router.post("/", verifyToken, mekanikController.create);
router.put("/:id", verifyToken, mekanikController.update);
router.delete("/:id", verifyToken, mekanikController.remove);

export default router;