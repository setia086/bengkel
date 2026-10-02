import express from "express";
import * as servisController from "../controllers/servis.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, servisController.getAll);
router.get("/:id", verifyToken, servisController.getById);
router.post("/", verifyToken, servisController.create);
router.put("/:id", verifyToken, servisController.update);
router.delete("/:id", verifyToken, servisController.remove);

export default router;