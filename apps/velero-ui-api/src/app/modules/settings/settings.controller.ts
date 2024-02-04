import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Observable, of } from 'rxjs';
import {
  ClusterSettings,
  VeleroAgentSettings,
  VeleroServerSettings,
  VeleroUiSettings,
} from '@velero-ui/shared-types';
import { DownloadRequestService } from '../../shared/modules/download-request/download-request.service';
import {V1ServerStatusRequest} from "@velero-ui/velero";
import {ServerStatusRequestService} from "../../shared/modules/server-status-request/server-status-request.service";

@Controller('/settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly serverStatusRequestService: ServerStatusRequestService
  ) {}

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
  public getVeleroPlugins(): Observable<V1ServerStatusRequest> {
    return this.serverStatusRequestService.create()
  }
}
