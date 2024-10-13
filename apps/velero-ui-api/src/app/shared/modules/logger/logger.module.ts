import { DynamicModule, Module } from '@nestjs/common';
import { AppLogger } from './logger.service';

@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: LoggerModule,
      imports: [],
      providers: [AppLogger],
      exports: [AppLogger],
    };
  }
}
