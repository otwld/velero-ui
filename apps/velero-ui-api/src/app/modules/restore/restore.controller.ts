import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RestoreService } from './restore.service';
import { Observable } from 'rxjs';
import { Ressources, V1Restore, V1RestoreList } from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/shared/modules/k8s-custom-object/k8s-custom-object.service';

@Controller('restores')
export class RestoreController {
  constructor(
    private readonly restoreService: RestoreService,
    private readonly k8sCustomObjectService: K8sCustomObjectService
  ) {}

  @Get()
  public get(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search: string
  ): Observable<V1RestoreList> {
    return this.k8sCustomObjectService.get<V1Restore, V1RestoreList>(
      Ressources.RESTORE.plurial,
      offset,
      limit,
      search
    );
  }

  @Get('/:name')
  public getByName(@Param('name') name: string): Observable<V1Restore> {
    return this.k8sCustomObjectService.getByName<V1Restore>(
      Ressources.BACKUP.plurial,
      name
    );
  }
}
