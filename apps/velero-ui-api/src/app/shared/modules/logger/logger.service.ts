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

  log(message: any, context?: string): void {
    this.logger.log('info', this.formatMessage(message), { context });
  }

  info(message: any, context?: string): void {
    this.logger.log('info', this.formatMessage(message), { context });
  }

  debug(message: any, context?: string): void {
    this.logger.log('debug', this.formatMessage(message), { context });
  }

  warn(message: any, context?: string): void {
    this.logger.log('warn', this.formatMessage(message), { context });
  }

  error(message: any, context?: string): void {
    this.logger.log('error', this.formatMessage(message), { context });
  }

  verbose(message: any, context?: string): void {
    this.logger.log('verbose', this.formatMessage(message), { context });
  }

  private formatMessage(message: any): string {
    if (message instanceof Error) {
      return `${message.message} \nStack Trace: ${message.stack}`;
    }

    if (typeof message === 'object') {
      return JSON.stringify(message);
    }
    return message;
  }

  private getFormat() {
    const env = this.configService.get<string>('app.env', {
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
      format.colorize({ all: true }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message, context }) => {
        const scope = context ?? 'App';
        return `${timestamp} ${level} [${scope}]: ${message}`;
      }),
    ];
  }
}
