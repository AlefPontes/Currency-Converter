export class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export class ApiError extends AppError {
  constructor(status, message = "Erro da API") {
    super(message, "API_ERROR");
    this.status = status;
    this.name = "ApiError";
  }
}

export class InternetError extends Error {
  constructor() {
    super("Erro de Internet", "INTERNET_ERROR");
    this.name = "InternetError";
  }
}
