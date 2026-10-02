import * as mekanikService from "../services/mekanik.service.js";
import { mekanikSchema } from "../validators/mekanik.validator.js";

export async function getAll(req, res) {
  try {
    const mekanik = await mekanikService.getAllMekanik();

    res.status(200).json({
      success: true,
      data: mekanik,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getById(req, res) {
  try {
    const id = Number(req.params.id);

    const mekanik = await mekanikService.getMekanikById(id);

    if (!mekanik) {
      return res.status(404).json({
        success: false,
        message: "Mekanik tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: mekanik,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function create(req, res) {
  try {
    const data = mekanikSchema.parse(req.body);

    const mekanik = await mekanikService.createMekanik(data);

    res.status(201).json({
      success: true,
      message: "Mekanik berhasil ditambahkan",
      data: mekanik,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function update(req, res) {
  try {
    const id = Number(req.params.id);

    const data = mekanikSchema.parse(req.body);

    const mekanik = await mekanikService.updateMekanik(id, data);

    res.status(200).json({
      success: true,
      message: "Mekanik berhasil diubah",
      data: mekanik,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);

    await mekanikService.deleteMekanik(id);

    res.status(200).json({
      success: true,
      message: "Mekanik berhasil dihapus",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}