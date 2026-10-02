import { success, failed } from "../utils/response.js";

export class BaseCrudController {
  constructor(service, entityName = "Data") {
    this.service = service;
    this.entityName = entityName;
  }

  getAll = async (req, res) => {
    try {
      const result = await this.service.findAll(req.query);

      res.status(200).json(
        success(
          result.data,
          result.pagination,
          `${this.entityName} berhasil diambil`
        )
      );
    } catch (error) {
      res.status(500).json(failed(error.message));
    }
  };

  getById = async (req, res) => {
    try {
      const data = await this.service.findById(Number(req.params.id));

      if (!data) {
        return res.status(404).json(failed(`${this.entityName} tidak ditemukan`));
      }

      res.status(200).json(success(data, null, `${this.entityName} berhasil diambil`));
    } catch (error) {
      res.status(500).json(failed(error.message));
    }
  };

  create = async (req, res) => {
    try {
      const data = await this.service.create(req.body);

      res.status(201).json(success(data, null, `${this.entityName} berhasil ditambahkan`));
    } catch (error) {
      res.status(400).json(failed(error.message));
    }
  };

  update = async (req, res) => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body);

      res.status(200).json(success(data, null, `${this.entityName} berhasil diubah`));
    } catch (error) {
      res.status(400).json(failed(error.message));
    }
  };

  remove = async (req, res) => {
    try {
      await this.service.delete(Number(req.params.id));

      res.status(200).json({
        success: true,
        message: `${this.entityName} berhasil dihapus`,
      });
    } catch (error) {
      res.status(500).json(failed(error.message));
    }
  };
}