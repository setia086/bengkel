import * as pelangganService from "../services/pelanggan.service.js";
import { pelangganSchema } from "../validators/pelanggan.validator.js";

export async function getAll(req, res) {
  try {
    const result = await pelangganService.getAllPelanggan(req.query);

    res.status(200).json({
      success: true,
      ...result,
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
    const data = await pelangganService.getPelangganById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Pelanggan tidak ditemukan",
      });
    }

    res.json({
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

export async function create(req, res) {
  try {
    const data = pelangganSchema.parse(req.body);

    const pelanggan = await pelangganService.createPelanggan(data);

    res.status(201).json({
      success: true,
      message: "Pelanggan berhasil ditambahkan",
      data: pelanggan,
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
    const data = pelangganSchema.partial().parse(req.body);

    const pelanggan = await pelangganService.updatePelanggan(
      req.params.id,
      data
    );

    res.json({
      success: true,
      message: "Pelanggan berhasil diubah",
      data: pelanggan,
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
    await pelangganService.deletePelanggan(req.params.id);

    res.json({
      success: true,
      message: "Pelanggan berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}