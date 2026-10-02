export function createPagination(total, page, limit) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}