import express from "express";
import * as kategoriSparepartController from "../controllers/kategoriSparepart.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, kategoriSparepartController.getAll);
router.get("/:id", verifyToken, kategoriSparepartController.getById);
router.post("/", verifyToken, kategoriSparepartController.create);
router.put("/:id", verifyToken, kategoriSparepartController.update);
router.delete("/:id", verifyToken, kategoriSparepartController.remove);

export default router;