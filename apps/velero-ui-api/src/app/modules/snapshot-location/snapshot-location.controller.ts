import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { SnapshotLocationService } from './snapshot-location.service';
import {
  Resources,
  V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  CreateVolumeSnapshotLocationDto,
  EditVolumeSnapshotLocationDto,
} from '@velero-ui-api/shared/dto/snapshot-location.dto';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { CheckPolicies } from '@velero-ui-api/shared/decorators/check-policies.decorator';
import { AppAbility } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { Action } from '@velero-ui/shared-types';

@Controller(Resources.VOLUME_SNAPSHOT_LOCATION.route)
@Subject(Resources.VOLUME_SNAPSHOT_LOCATION.subject)
export class SnapshotLocationController extends K8sCustomObjectController<
  V1VolumeSnapshotLocation,
  V1VolumeSnapshotLocationList
> {
  constructor(
    private readonly snapshotLocationService: SnapshotLocationService,
    readonly k8sCustomObjectService: K8sCustomObjectService
  ) {
    super(k8sCustomObjectService, Resources.VOLUME_SNAPSHOT_LOCATION);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, Resources.VOLUME_SNAPSHOT_LOCATION.subject)
  )
  public create(@Body() data: CreateVolumeSnapshotLocationDto) {
    return this.snapshotLocationService.create(data);
  }

  @Put('/:name')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, Resources.VOLUME_SNAPSHOT_LOCATION.subject)
  )
  public editByName(
    @Param('name') name: string,
    @Body() data: EditVolumeSnapshotLocationDto
  ) {
    return this.snapshotLocationService.edit(name, data);
  }
}
