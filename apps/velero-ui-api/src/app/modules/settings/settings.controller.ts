import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Observable } from 'rxjs';
import {
  Action,
  ClusterSettings,
  VeleroAgentSettings,
  VeleroServerSettings,
  VeleroUiSettings,
} from '@velero-ui/shared-types';
import { V1PluginInfo } from '@velero-ui/velero';
import { AddVeleroPluginDTO } from '@velero-ui-api/shared/dto/settings.dto';
import { CheckPolicies } from '@velero-ui-api/shared/decorators/check-policies.decorator';
import { AppAbility } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller('/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('/cluster')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  public getCluster(): Observable<ClusterSettings> {
    return this.settingsService.getCluster();
  }

  @Get('/velero/server')
  public getVeleroServer(): Observable<VeleroServerSettings> {
    return this.settingsService.getVeleroServer();
  }

  @Get('/velero/agents')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  public getVeleroAgents(): Observable<VeleroAgentSettings[]> {
    return this.settingsService.getVeleroAgents();
  }

  @Get('/velero/ui')
  public getVeleroUi(): Observable<VeleroUiSettings> {
    return this.settingsService.getVeleroUi();
  }

  @Get('/velero/plugins')
  @UseInterceptors(CacheInterceptor)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  public getVeleroPlugins(): Observable<V1PluginInfo[]> {
    return this.settingsService.getPlugins();
  }

  @Post('/velero/plugins')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  public addVeleroPlugin(@Body() data: AddVeleroPluginDTO) {
    return {};
  }

  @Delete('/velero/plugins/:name')
  public deleteVeleroPluginByName(@Param('name') name: string) {
    return {};
  }
}
