import express from "express";
import * as kendaraanController from "../controllers/kendaraan.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", kendaraanController.getAll);
router.get("/:id", kendaraanController.getById);
router.post("/", kendaraanController.create);
router.put("/:id", kendaraanController.update);
router.delete("/:id", kendaraanController.remove);

export default router;