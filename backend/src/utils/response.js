export function success(data, pagination = null, message = "Success") {
  return {
    success: true,
    message,
    data,
    pagination,
  };
}

export function failed(message) {
  return {
    success: false,
    message,
  };
}