

export const home = (req, res) => {
  res.json({
    success: true,
    message: "Backend Bengkel Berjalan",
    version: "1.0.0"
  });
};
export async function profile(req, res) {
  try {
    const user = await getProfile(req.user.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}