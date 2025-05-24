import { Controller } from '@nestjs/common';
import { Resources, V1ServerStatusRequest } from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';

@Controller(Resources.SERVER_STATUS_REQUEST.route)
@Subject(Resources.BACKUP.plural)
export class ServerStatusRequestController extends K8sCustomObjectController<V1ServerStatusRequest> {
  constructor(readonly k8sCustomObjectService: K8sCustomObjectService) {
    super(k8sCustomObjectService, Resources.SERVER_STATUS_REQUEST);
  }
}
