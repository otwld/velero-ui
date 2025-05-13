import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Observable } from 'rxjs';
import type {
  ClusterSettings,
  VeleroAgentSettings,
  VeleroServerSettings,
  VeleroUiSettings,
} from '@velero-ui/shared-types';
import { V1PluginInfo } from '@velero-ui/velero';
import { AddVeleroPluginDTO } from '@velero-ui-api/shared/dto/settings.dto';

@Controller('/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('/cluster')
  public getCluster(): Observable<ClusterSettings> {
    return this.settingsService.getCluster();
  }

  @Get('/velero/server')
  public getVeleroServer(): Observable<VeleroServerSettings> {
    return this.settingsService.getVeleroServer();
  }

  @Get('/velero/agents')
  public getVeleroAgents(): Observable<VeleroAgentSettings[]> {
    return this.settingsService.getVeleroAgents();
  }

  @Get('/velero/ui')
  public getVeleroUi(): Observable<VeleroUiSettings> {
    return this.settingsService.getVeleroUi();
  }

  @Get('/velero/plugins')
  public getVeleroPlugins(): Observable<V1PluginInfo[]> {
    return this.settingsService.getPlugins();
  }

  @Post('/velero/plugins')
  public addVeleroPlugin(@Body() data: AddVeleroPluginDTO) {
    return {};
  }

  @Delete('/velero/plugins/:name')
  public deleteVeleroPluginByName(@Param('name') name: string) {
    return {};
  }
}
