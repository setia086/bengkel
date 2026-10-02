import express from "express";
import * as sparepartController from "../controllers/sparepart.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, sparepartController.getAll);
router.get("/:id", verifyToken, sparepartController.getById);
router.post("/", verifyToken, sparepartController.create);
router.put("/:id", verifyToken, sparepartController.update);
router.delete("/:id", verifyToken, sparepartController.remove);

export default router;