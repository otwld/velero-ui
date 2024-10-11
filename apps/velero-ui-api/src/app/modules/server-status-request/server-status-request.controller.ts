import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  Resources,
  V1ServerStatusRequest,
  V1ServerStatusRequestList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';
import { ServerStatusRequestService } from '@velero-ui-api/modules/server-status-request/server-status-request.service';

@Controller(Resources.SERVER_STATUS_REQUEST.route)
export class ServerStatusRequestController {
  constructor(
    private readonly serverStatusRequestService: ServerStatusRequestService,
    private readonly k8sCustomObjectService: K8sCustomObjectService,
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('sortColumnName', new DefaultValuePipe('')) sortColumnName: string,
    @Query('sortColumnAscending', new DefaultValuePipe(''))
    sortColumnAscending: boolean,
  ): Observable<V1ServerStatusRequestList> {
    return this.k8sCustomObjectService.get<
      V1ServerStatusRequest,
      V1ServerStatusRequestList
    >(
      Resources.SERVER_STATUS_REQUEST.plurial,
      offset,
      limit,
      search,
      sortColumnName,
      sortColumnAscending,
    );
  }

  @Get('/:name')
  public getByName(
    @Param('name') name: string,
  ): Observable<V1ServerStatusRequest> {
    return this.k8sCustomObjectService.getByName<V1ServerStatusRequest>(
      Resources.SERVER_STATUS_REQUEST.plurial,
      name,
    );
  }

  @Delete('/:name')
  public deleteByName(@Param('name') name: string): void {
    return this.serverStatusRequestService.deleteByName(name);
  }
}
