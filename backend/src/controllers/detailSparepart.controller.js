import * as detailSparepartService from "../services/detailSparepart.service.js";
import { detailSparepartSchema } from "../validators/detailSparepart.validator.js";

export async function getAll(req, res) {
  try {
    const detailSparepart = await detailSparepartService.getAllDetailSparepart();
    res.json(detailSparepart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const id = Number(req.params.id);

    const detailSparepart = await detailSparepartService.getDetailSparepartById(id);

    if (!detailSparepart) {
      return res.status(404).json({
        error: "Detail Sparepart tidak ditemukan",
      });
    }

    res.json(detailSparepart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const data = detailSparepartSchema.parse(req.body);

    const detailSparepart =
      await detailSparepartService.createDetailSparepart(data);

    res.status(201).json(detailSparepart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const id = Number(req.params.id);

    const data = detailSparepartSchema.parse(req.body);

    const detailSparepart =
      await detailSparepartService.updateDetailSparepart(id, data);

    res.json(detailSparepart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);

    await detailSparepartService.deleteDetailSparepart(id);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}