import * as sparepartService from "../services/sparepart.service.js";
import { sparepartSchema } from "../validators/sparepart.validator.js";

export async function getAll(req, res) {
  try {
    const sparepart = await sparepartService.getAllSparepart();
    res.json(sparepart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const id = Number(req.params.id);

    const sparepart = await sparepartService.getSparepartById(id);

    if (!sparepart) {
      return res.status(404).json({
        error: "Sparepart tidak ditemukan",
      });
    }

    res.json(sparepart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const data = sparepartSchema.parse(req.body);

    const sparepart = await sparepartService.createSparepart(data);

    res.status(201).json(sparepart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const id = Number(req.params.id);

    const data = sparepartSchema.parse(req.body);

    const sparepart = await sparepartService.updateSparepart(id, data);

    res.json(sparepart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);

    await sparepartService.deleteSparepart(id);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}