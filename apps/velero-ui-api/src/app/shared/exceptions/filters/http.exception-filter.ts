import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const status: number = exception.getStatus();
    const cause: string = <string>exception.cause;

    console.error(exception)

    this.logger.error(exception.message, cause ? cause : HttpExceptionFilter.name);

    // @ts-expect-error handle response.status as function
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      ok: status < 400,
      message: exception.message,
      test: exception.name,
    });
  }
}
