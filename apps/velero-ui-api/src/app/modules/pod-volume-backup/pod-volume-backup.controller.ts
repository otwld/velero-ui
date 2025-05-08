import { Controller } from '@nestjs/common';
import {
  Resources,
  V1PodVolumeBackup,
  V1PodVolumeBackupList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';

@Controller(Resources.POD_VOLUME_BACKUP.route)
@Subject(Resources.POD_VOLUME_BACKUP.subject)
export class PodVolumeBackupController extends K8sCustomObjectController<
  V1PodVolumeBackup,
  V1PodVolumeBackupList
> {
  constructor(readonly k8sCustomObjectService: K8sCustomObjectService) {
    super(k8sCustomObjectService, Resources.POD_VOLUME_BACKUP);
  }
}
