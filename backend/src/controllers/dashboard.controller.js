import * as dashboardService from "../services/dashboard.service.js";

export async function getDashboard(req, res) {
  try {
    const data = await dashboardService.getDashboard();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getUserDashboard(req, res) {
  try {
    const data = await dashboardService.getUserDashboard(req.user.id);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}