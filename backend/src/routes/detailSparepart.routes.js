import express from "express";
import * as detailSparepartController from "../controllers/detailSparepart.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, detailSparepartController.getAll);
router.get("/:id", verifyToken, detailSparepartController.getById);
router.post("/", verifyToken, detailSparepartController.create);
router.put("/:id", verifyToken, detailSparepartController.update);
router.delete("/:id", verifyToken, detailSparepartController.remove);

export default router;