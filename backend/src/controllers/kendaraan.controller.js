import * as kendaraanService from "../services/kendaraan.service.js";
import { kendaraanSchema } from "../validators/kendaraan.validator.js";

export async function getAll(req, res, next) {
  try {
    const data = await kendaraanService.getAllKendaraan();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await kendaraanService.getKendaraanById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Kendaraan tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const data = kendaraanSchema.parse(req.body);

    const kendaraan = await kendaraanService.createKendaraan(data);

    res.status(201).json({
      success: true,
      message: "Kendaraan berhasil ditambahkan",
      data: kendaraan,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const data = kendaraanSchema.partial().parse(req.body);

    const kendaraan = await kendaraanService.updateKendaraan(
      req.params.id,
      data
    );

    res.json({
      success: true,
      message: "Kendaraan berhasil diubah",
      data: kendaraan,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await kendaraanService.deleteKendaraan(req.params.id);

    res.json({
      success: true,
      message: "Kendaraan berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
}