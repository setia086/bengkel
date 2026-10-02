export function buildQuery(query, searchFields = []) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search || "";
  const sort = query.sort || "id";
  const order = query.order === "desc" ? "desc" : "asc";

  const where = search
    ? {
        OR: searchFields.map((field) => ({
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