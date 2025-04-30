import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

import { ConfigService } from '@nestjs/config';
import { Environment } from '@velero-ui/shared-types';
import { TransformableInfo } from 'logform';

@Injectable()
export class AppLogger implements LoggerService {
  public readonly logger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.logger = createLogger({
      level: this.configService.get<string>('app.logLevel', { infer: true }),
      transports: [
        new transports.Console({
          format: format.combine(...this.getFormat()),
        }),
      ],
    });
  }

  public log(message: string, scope: string): void {
    this.logger.log(message, scope);
  }

  public info(message: string, scope: string): void;

  public info(message: never, ...optionalParams: never[]): void {
    this.logger.info(message, optionalParams);
  }

  public debug(message: string, scope: string);

  public debug(message: object, scope: string);

  public debug(message: never, ...optionalParams: never[]): void {
    this.logger.debug(message, optionalParams);
  }

  public error(message: string, scope: string): void;

  public error(message: object, scope: string);

  public error(message: never, ...optionalParams: never[]): void {
    this.logger.error(message, optionalParams);
  }

  public verbose(message: never, scope: string);

  public verbose(message: never, ...optionalParams: never[]): void {
    this.logger.verbose(message, optionalParams);
  }

  public warn(message: never, scope: string);

  public warn(message: never, ...optionalParams: never[]): void {
    this.logger.warn(message, optionalParams);
  }

  private getFormat() {
    const env = this.configService.get<Environment>('app.environment', {
      infer: true,
    });

    if (env === Environment.PRODUCTION) {
      return [
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.ms(),
        format.json(),
      ];
    }

    return [
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(
        (info: TransformableInfo) =>
          `${info['timestamp']} ${info.level} [${
            info['scope'] ?? 'App'
          }]: ${info.message}`,
      ),
    ];
  }
}
