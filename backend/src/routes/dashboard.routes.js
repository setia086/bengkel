import express from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, dashboardController.getDashboard);
router.get("/user", verifyToken, dashboardController.getUserDashboard);

export default router;