import { Module } from '@nestjs/common';
import { RestoreController } from './restore.controller';
import { RestoreService } from './restore.service';

@Module({
  controllers: [RestoreController],
  providers: [RestoreService],
})
export class RestoreModule {}
