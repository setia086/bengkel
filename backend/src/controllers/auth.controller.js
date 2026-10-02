import { loginService, registerService } from "../services/auth.service.js";
import { getProfile } from "../services/user.service.js";

export async function register(req, res) {
  try {
    const { nama, telepon, email, password } = req.body;

    if (!nama || !telepon || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, nomor telepon, email, dan password wajib diisi",
      });
    }

    const result = await registerService({ nama, telepon, email, password });

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await loginService(email, password);

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}

export async function profile(req, res) {
  try {
    const user = await getProfile(req.user.id);

    res.status(200).json({
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