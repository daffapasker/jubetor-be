export class ApiResponse {
  success;
  message;
  data;
  meta;

  constructor(message = "Success", data, meta) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
}

export class ApiError extends Error {
  success;
  statusCode;
  errors;

  constructor(statusCode, message, errors) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}