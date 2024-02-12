import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  Ressources,
  V1ServerStatusRequest,
  V1ServerStatusRequestList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';
import { ServerStatusRequestService } from '@velero-ui-api/modules/server-status-request/server-status-request.service';

@Controller('server-status-requests')
export class ServerStatusRequestController {
  constructor(
    private readonly serverStatusRequestService: ServerStatusRequestService,
    private readonly k8sCustomObjectService: K8sCustomObjectService
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1ServerStatusRequestList> {
    return this.k8sCustomObjectService.get<
      V1ServerStatusRequest,
      V1ServerStatusRequestList
    >(Ressources.SERVER_STATUS_REQUEST.plurial, offset, limit, search);
  }

  @Get('/:name')
  public getByName(
    @Param('name') name: string
  ): Observable<V1ServerStatusRequest> {
    return this.k8sCustomObjectService.getByName<V1ServerStatusRequest>(
      Ressources.SERVER_STATUS_REQUEST.plurial,
      name
    );
  }
}
