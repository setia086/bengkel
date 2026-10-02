import express from "express";
import * as pembayaranController from "../controllers/pembayaran.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, pembayaranController.getAll);
router.get("/:id", verifyToken, pembayaranController.getById);
router.post("/user", verifyToken, pembayaranController.createForUser);
router.post("/", verifyToken, pembayaranController.create);
router.put("/:id", verifyToken, pembayaranController.update);
router.delete("/:id", verifyToken, pembayaranController.remove);

export default router;