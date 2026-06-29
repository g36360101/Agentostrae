import {
  Catch,
  HttpException,
  HttpStatus,
  type ArgumentsHost,
  type ExceptionFilter,
} from "@nestjs/common";
import type { Request, Response } from "express";

interface ErrorBody {
  code?: string;
  message?: string | string[];
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const body = typeof exceptionResponse === "object" ? (exceptionResponse as ErrorBody) : null;
    const rawMessage = body?.message ?? "An unexpected error occurred";

    response.status(status).json({
      success: false,
      error: {
        code: body?.code ?? (status === 500 ? "INTERNAL_ERROR" : `HTTP_${status}`),
        message: Array.isArray(rawMessage) ? rawMessage.join("; ") : rawMessage,
        requestId: request.headers["x-request-id"],
      },
    });
  }
}
