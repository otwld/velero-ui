import { Controller } from '@nestjs/common';
import {
  Resources,
  V1DeleteBackupRequest,
  V1DeleteBackupRequestList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';

@Controller(Resources.DELETE_BACKUP_REQUEST.route)
@Subject(Resources.DELETE_BACKUP_REQUEST.subject)
export class DeleteBackupRequestController extends K8sCustomObjectController<
  V1DeleteBackupRequest,
  V1DeleteBackupRequestList
> {
  constructor(readonly k8sCustomObjectService: K8sCustomObjectService) {
    super(k8sCustomObjectService, Resources.DELETE_BACKUP_REQUEST);
  }
}
