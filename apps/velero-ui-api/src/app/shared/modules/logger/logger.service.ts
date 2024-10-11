import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppLogger extends ConsoleLogger implements LoggerService {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  public debug(message: string, context?: string) {
    super.debug(message, context);
  }
}
