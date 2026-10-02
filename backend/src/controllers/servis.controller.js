import * as servisService from "../services/servis.service.js";
import { servisSchema } from "../validators/servis.validator.js";

export async function getAll(req, res) {
  try {
    const servis = await servisService.getAllServis();
    res.json(servis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const id = Number(req.params.id);

    const servis = await servisService.getServisById(id);

    if (!servis) {
      return res.status(404).json({
        error: "Data servis tidak ditemukan",
      });
    }

    res.json(servis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const data = servisSchema.parse(req.body);

    const servis = await servisService.createServis(data);

    res.status(201).json(servis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const id = Number(req.params.id);

    const data = servisSchema.parse(req.body);

    const servis = await servisService.updateServis(id, data);

    res.json(servis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);

    await servisService.deleteServis(id);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}