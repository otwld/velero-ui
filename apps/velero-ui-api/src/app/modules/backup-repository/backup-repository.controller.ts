import {
  Controller,
} from '@nestjs/common';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import {
  Resources,
  V1BackupRepository,
  V1BackupRepositoryList,
} from '@velero-ui/velero';
import { Subject } from "@velero-ui-api/shared/decorators/subject.decorator";
import { K8sCustomObjectController } from "@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller";

@Controller(Resources.BACKUP_REPOSITORY.route)
@Subject(Resources.BACKUP_REPOSITORY.subject)
export class BackupRepositoryController extends K8sCustomObjectController<V1BackupRepository, V1BackupRepositoryList> {
  constructor(
    readonly k8sCustomObjectService: K8sCustomObjectService,
  ) {
    super(k8sCustomObjectService, Resources.BACKUP_REPOSITORY);
  }
}
