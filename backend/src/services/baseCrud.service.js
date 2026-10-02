export class BaseCrudService {
  constructor(prismaModel, searchFields = []) {
    this.model = prismaModel;
    this.searchFields = searchFields;
  }

  buildQuery(query = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query.search || "";
    const sort = query.sort || "id";
    const order = query.order === "desc" ? "desc" : "asc";

    const where = search
      ? {
          OR: this.searchFields.map((field) => ({
            [field]: {
              contains: search,
              mode: "insensitive",
            },
          })),
        }
      : {};

    return {
      where,
      skip,
      take: limit,
      orderBy: {
        [sort]: order,
      },
      page,
      limit,
    };
  }

  async findAll(query = {}, include = {}) {
    const options = this.buildQuery(query);

    const [data, total] = await Promise.all([
      this.model.findMany({
        where: options.where,
        skip: options.skip,
        take: options.take,
        orderBy: options.orderBy,
        include,
      }),

      this.model.count({
        where: options.where,
      }),
    ]);

    return {
      data,
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }

  async findById(id, include = {}) {
    return await this.model.findUnique({
      where: { id },
      include,
    });
  }

  async create(data) {
    return await this.model.create({
      data,
    });
  }

  async update(id, data) {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await this.model.delete({
      where: { id },
    });
  }
}