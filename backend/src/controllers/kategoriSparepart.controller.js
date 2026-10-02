import * as kategoriSparepartService from "../services/kategoriSparepart.service.js";
import { kategoriSparepartSchema } from "../validators/kategoriSparepart.validator.js"; 

export async function getAll(req, res) {
  try {
    const kategoriSparepart = await kategoriSparepartService.getAllKategoriSparepart(); 
    res.json(kategoriSparepart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const id = Number(req.params.id);
    const kategoriSparepart = await kategoriSparepartService.getKategoriSparepartById(id);                                              
    if (!kategoriSparepart) {
      return res.status(404).json({ error: "Kategori Sparepart not found" });
    }
    res.json(kategoriSparepart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const data = kategoriSparepartSchema.parse(req.body); 
    const newKategoriSparepart = await kategoriSparepartService.createKategoriSparepart(data); 
    res.status(201).json(newKategoriSparepart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  } 
}       

export async function update(req, res) {
  try {
    const id = Number(req.params.id);
    const data = kategoriSparepartSchema.parse(req.body); 
    const updatedKategoriSparepart = await kategoriSparepartService.updateKategoriSparepart(id, data); 
    res.json(updatedKategoriSparepart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}           

export async function remove(req, res) {
  try {
    const id = Number(req.params.id);
    await kategoriSparepartService.deleteKategoriSparepart(id); 
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

