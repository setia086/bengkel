import * as pembayaranService from "../services/pembayaran.service.js";
import { pembayaranSchema } from "../validators/pembayaran.validator.js";

export async function getAll(req, res) {
  try {
    const pembayaran = await pembayaranService.getAllPembayaran();
    res.json(pembayaran);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const id = Number(req.params.id);

    const pembayaran = await pembayaranService.getPembayaranById(id);

    if (!pembayaran) {
      return res.status(404).json({
        error: "Data pembayaran tidak ditemukan",
      });
    }

    res.json(pembayaran);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const data = pembayaranSchema.parse(req.body);

    const pembayaran = await pembayaranService.createPembayaran(data);

    res.status(201).json({
      success: true,
      message: "Pembayaran berhasil",
      data: pembayaran,
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

    const data = pembayaranSchema.partial().parse(req.body);

    const pembayaran = await pembayaranService.updatePembayaran(id, data);

    res.json({
      success: true,
      message: "Pembayaran berhasil diupdate",
      data: pembayaran,
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

    await pembayaranService.deletePembayaran(id);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function createForUser(req, res) {
  try {
    const data = pembayaranSchema.parse(req.body);
    const pembayaran = await pembayaranService.createUserPembayaran(req.user.id, data);

    res.status(201).json({ success: true, message: "Pembayaran berhasil", data: pembayaran });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}