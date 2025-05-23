import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { StorageLocationService } from './storage-location.service';
import { Resources, V1BackupStorageLocation } from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  CreateStorageLocationDto,
  EditStorageLocationDto,
} from '@velero-ui-api/shared/dto/storage-location.dto';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';
import { CheckPolicies } from '@velero-ui-api/shared/decorators/check-policies.decorator';
import { AppAbility } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { Action } from '@velero-ui/shared-types';

@Controller(Resources.BACKUP_STORAGE_LOCATION.route)
@Subject(Resources.BACKUP_STORAGE_LOCATION.plural)
export class StorageLocationController extends K8sCustomObjectController<V1BackupStorageLocation> {
  constructor(
    private readonly storageLocationService: StorageLocationService,
    readonly k8sCustomObjectService: K8sCustomObjectService
  ) {
    super(k8sCustomObjectService, Resources.BACKUP_STORAGE_LOCATION);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Resources.BACKUP_STORAGE_LOCATION.plural)
  )
  public create(@Body() data: CreateStorageLocationDto) {
    return this.storageLocationService.create(data);
  }

  @Put('/:name')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Resources.BACKUP_STORAGE_LOCATION.plural)
  )
  public editByName(
    @Param('name') name: string,
    @Body() data: EditStorageLocationDto
  ) {
    return this.storageLocationService.edit(name, data);
  }
}
