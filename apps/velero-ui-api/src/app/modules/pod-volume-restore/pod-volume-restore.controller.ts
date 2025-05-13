import { Controller } from '@nestjs/common';
import {
  Resources,
  V1PodVolumeRestore,
  V1PodVolumeRestoreList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';

@Controller(Resources.POD_VOLUME_RESTORE.route)
@Subject(Resources.POD_VOLUME_RESTORE.plural)
export class PodVolumeRestoreController extends K8sCustomObjectController<
  V1PodVolumeRestore,
  V1PodVolumeRestoreList
> {
  constructor(readonly k8sCustomObjectService: K8sCustomObjectService) {
    super(k8sCustomObjectService, Resources.POD_VOLUME_RESTORE);
  }
}
