import * as detailServisService from "../services/detailServis.service.js";
import { detailServisSchema } from "../validators/detailServis.validator.js";

export async function getAll(req, res) {
  try {
    const detailServis = await detailServisService.getAllDetailServis();
    res.json(detailServis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const id = Number(req.params.id);

    const detailServis = await detailServisService.getDetailServisById(id);

    if (!detailServis) {
      return res.status(404).json({
        error: "Detail Servis tidak ditemukan",
      });
    }

    res.json(detailServis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const data = detailServisSchema.parse(req.body);

    const detailServis =
      await detailServisService.createDetailServis(data);

    res.status(201).json(detailServis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const id = Number(req.params.id);

    const data = detailServisSchema.parse(req.body);

    const detailServis =
      await detailServisService.updateDetailServis(id, data);

    res.json(detailServis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);

    await detailServisService.deleteDetailServis(id);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}