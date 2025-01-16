import { Body, Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { V1DownloadRequestList } from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { DownloadRequestService } from '@velero-ui-api/modules/download-request/download-request.service';
import {
  K8sCustomObjectParams,
  K8SCustomObjectQueries,
} from '@velero-ui-api/shared/dto/k8s-custom-object.dto';
import {
  KubernetesListObject,
  KubernetesObject,
} from '@kubernetes/client-node';

@Controller('/resources')
export class K8sCustomObjectController {
  constructor(
    private readonly k8sCustomObjectService: K8sCustomObjectService,
  ) {}

  @Get('/:plural')
  public get(
    @Param() params: K8sCustomObjectParams,
    @Query() queries: K8SCustomObjectQueries,
  ): Observable<V1DownloadRequestList> {
    return this.k8sCustomObjectService.get<
      KubernetesObject,
      KubernetesListObject<KubernetesObject>
    >(
      params.plural,
      queries.offset,
      queries.limit,
      queries.search,
      queries.sortColumnName,
      queries.sortColumnAscending,
    );
  }

  @Get('/:plural/:name')
  public getByName(
    @Param() params: K8sCustomObjectParams,
  ): Observable<KubernetesObject> {
    return this.k8sCustomObjectService.getByName<KubernetesObject>(
      params.plural,
      params.name,
    );
  }

  @Delete('/:plural')
  public delete(
    @Param() params: K8sCustomObjectParams,
    @Body() names: string[],
  ): Observable<void> {
    return this.k8sCustomObjectService.delete(params.plural, names);
  }

  @Delete('/:plural/:name')
  public deleteByName(
    @Param() params: K8sCustomObjectParams,
  ): Observable<void> {
    return this.k8sCustomObjectService.deleteByName(params.plural, params.name);
  }
}
