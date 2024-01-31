import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { BackupService } from './backup.service';
import { concatMap, from, Observable } from 'rxjs';
import { V1Backup, V1BackupList } from '@velero-ui/shared-types';
import { CreateDeleteBackRequestDto } from '../../shared/dto/delete-backup-request.dto';
import { DeleteBackupRequestService } from '../delete-backup-request/delete-backup-request.service';

@Controller('backups')
export class BackupController {
  constructor(
    private readonly backupService: BackupService,
    private readonly deleteBackupRequestService: DeleteBackupRequestService
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1BackupList> {
    return this.backupService.find(offset, limit, search);
  }

  @Post('/restore')
  public restore(@Body() names: string[]) {
    return {};
  }

  @Post('/download')
  public download(@Body() names: string[]) {
    return {};
  }

  @Delete()
  public delete(@Body() backups: CreateDeleteBackRequestDto[]) {
    return from(backups).pipe(
      concatMap((backup: CreateDeleteBackRequestDto) =>
        this.deleteBackupRequestService.create(backup)
      )
    );
  }

  @Post()
  public create() {
    return {};
  }

  @Get('/:namespace/:name')
  public getByName(
    @Param('name') name: string,
    @Param('namespace') namespace: string
  ): Observable<V1Backup> {
    return this.backupService.findByName(name, namespace);
  }

  @Get('/:namespace/:name/logs')
  public logs(@Param('name') name: string) {
    return this.backupService.logs(name);
  }

  @Post('/:namespace/:name/restore')
  public restoreByName(@Param('name') name: string) {
    return {};
  }

  @Post('/:namespace/:name/download')
  public downloadByName(@Param('name') name: string) {
    return {};
  }

  @Delete('/:namespace/:name')
  public deleteByName(
    @Param('name') name: string,
    @Param('namespace') namespace: string
  ) {
    return this.deleteBackupRequestService.create({
      name,
      namespace,
    });
  }
}
