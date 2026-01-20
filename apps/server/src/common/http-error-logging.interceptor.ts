import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class HttpErrorLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, headers } = request;

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        // Log non-2xx status codes
        if (statusCode >= 300) {
          this.logHttpEvent(method, url, statusCode, body, headers, null);
        }
      }),
      catchError((error) => {
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        this.logHttpEvent(
          method,
          url,
          statusCode,
          body,
          headers,
          error
        );
        return throwError(() => error);
      })
    );
  }

  private logHttpEvent(
    method: string,
    url: string,
    statusCode: number,
    body: any,
    headers: any,
    error: any
  ) {
    const errorMessage = error?.message || error?.response?.message || 'No message';
    const errorResponse = error?.response || null;

    const logData = {
      timestamp: new Date().toISOString(),
      method,
      url,
      statusCode,
      statusText: this.getStatusText(statusCode),
      errorMessage,
      errorResponse,
      // Log request body (excluding sensitive data)
      requestBody: this.sanitizeBody(body),
      // Log certain headers
      headers: {
        'content-type': headers['content-type'],
        'authorization': headers['authorization'] ? '[REDACTED]' : undefined,
        'user-agent': headers['user-agent'],
      },
    };

    const logMessage = `${method} ${url} - ${statusCode} ${this.getStatusText(statusCode)}`;

    if (statusCode >= 500) {
      this.logger.error(logMessage, JSON.stringify(logData));
    } else if (statusCode >= 400) {
      this.logger.warn(logMessage, JSON.stringify(logData));
    } else if (statusCode >= 300) {
      this.logger.log(logMessage);
    }
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;

    const sensitiveFields = ['password', 'apiKey', 'key', 'token', 'secret'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private getStatusText(statusCode: number): string {
    const statusTexts: { [key: number]: string } = {
      301: 'Moved Permanently',
      302: 'Found',
      304: 'Not Modified',
      307: 'Temporary Redirect',
      308: 'Permanent Redirect',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      409: 'Conflict',
      410: 'Gone',
      413: 'Payload Too Large',
      415: 'Unsupported Media Type',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      501: 'Not Implemented',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
    };

    return statusTexts[statusCode] || 'Unknown';
  }
}
