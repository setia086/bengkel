import express from "express";
import * as pelangganController from "../controllers/pelanggan.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, pelangganController.getAll);
router.get("/:id", verifyToken, pelangganController.getById);
router.post("/", verifyToken, pelangganController.create);
router.put("/:id", verifyToken, pelangganController.update);
router.delete("/:id", verifyToken, pelangganController.remove);

export default router;