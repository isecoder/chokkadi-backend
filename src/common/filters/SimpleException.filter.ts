import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Catch all exceptions
export class SimpleExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SimpleExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message, type } = this.extractErrorDetails(exception);

    this.logError(type, status, request, message, this.getStack(exception));

    // Ensure status is always a number
    response.status(Number(status)).json({
      statusCode: Number(status), // Ensure numeric status code
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      type,
      message,
    });
  }

  private extractErrorDetails(exception: unknown): {
    status: number;
    message: string | string[];
    type: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : (response as any).message || 'An unexpected error occurred';
      return { status, message, type: 'HTTP Exception' };
    }

    if (
      typeof exception === 'object' &&
      exception !== null &&
      'statusCode' in exception
    ) {
      return {
        status: Number((exception as any).statusCode) || 500, // Convert statusCode to number
        message: (exception as any).message || 'An unknown error occurred',
        type: 'Custom Exception',
      };
    }

    return {
      status: 500,
      message: exception instanceof Error ? exception.message : 'Unknown Error',
      type: 'Non-HTTP Exception',
    };
  }

  private logError(
    exceptionType: string,
    status: number,
    request: Request,
    message: string | string[],
    stack: string,
  ) {
    this.logger.error(
      `\nError Details:\n` +
        `\t- Exception Type: ${exceptionType}\n` +
        `\t- HTTP Method: ${request.method}\n` +
        `\t- URL: ${request.url}\n` +
        `\t- Status Code: ${status}\n` +
        `\t- Message: ${Array.isArray(message) ? message.join(', ') : message}\n` +
        `\t- Stack Trace:\n${this.formatStackTrace(stack)}\n`,
    );
  }

  private getStack(exception: unknown): string {
    return exception instanceof Error ? exception.stack || '' : '';
  }

  private formatStackTrace(stack: string): string {
    return stack
      .split('\n')
      .map((line, index) => `\t\t${index === 0 ? '🔴 ' : '↳ '}${line.trim()}`)
      .join('\n');
  }
}
