import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { BackupService } from './backup.service';
import { Observable } from 'rxjs';
import { Backup } from '@velero-ui/shared-types';

@Controller('backups')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<any> {
    return this.backupService.find(offset, limit, search);
  }

  @Get('/:namespace/:name')
  public getByName(
    @Param('name') name: string,
    @Param('namespace') namespace: string
  ): Observable<Backup> {
    return this.backupService.findByName(name, namespace);
  }

  @Get('/:namespace/:name/logs')
  public logs(
    @Param('name') name: string
  ) {
    return this.backupService.logs(name);
  }

  @Delete('/:namespace/:name')
  public deleteByName(
    @Param('name') name: string,
    @Param('namespace') namespace: string
  ) {
    return {};
  }

  @Delete()
  public delete(@Body() names: string[]) {
    return this.backupService.delete(names);
  }
}
