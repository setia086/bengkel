import express from "express";
import * as detailServisController from "../controllers/detailServis.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, detailServisController.getAll);
router.get("/:id", verifyToken, detailServisController.getById);
router.post("/", verifyToken, detailServisController.create);
router.put("/:id", verifyToken, detailServisController.update);
router.delete("/:id", verifyToken, detailServisController.remove);

export default router;