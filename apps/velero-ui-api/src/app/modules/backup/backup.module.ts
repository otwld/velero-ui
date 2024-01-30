import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';

@Module({
  providers: [BackupService],
  controllers: [BackupController],
})
export class BackupModule {}
