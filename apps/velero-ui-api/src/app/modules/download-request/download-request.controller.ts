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
  V1DownloadRequest,
  V1DownloadRequestList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';

@Controller('download-requests')
export class DownloadRequestController {
  constructor(
    private readonly downloadRequestService: DownloadRequestService,
    private readonly k8sCustomObjectService: K8sCustomObjectService
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1DownloadRequestList> {
    return this.k8sCustomObjectService.get<
      V1DownloadRequest,
      V1DownloadRequestList
    >(Ressources.DOWNLOAD_REQUEST.plurial, offset, limit, search);
  }

  @Get('/:name')
  public getByName(@Param('name') name: string): Observable<V1DownloadRequest> {
    return this.k8sCustomObjectService.getByName<V1DownloadRequest>(
      Ressources.DOWNLOAD_REQUEST.plurial,
      name
    );
  }
}
