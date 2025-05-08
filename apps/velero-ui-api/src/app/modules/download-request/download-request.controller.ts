import { Controller } from '@nestjs/common';
import {
  Resources,
  V1DownloadRequest,
  V1DownloadRequestList,
} from '@velero-ui/velero';
import { K8sCustomObjectService } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.service';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { Subject } from '@velero-ui-api/shared/decorators/subject.decorator';

@Controller(Resources.DOWNLOAD_REQUEST.route)
@Subject(Resources.DOWNLOAD_REQUEST.subject)
export class DownloadRequestController extends K8sCustomObjectController<
  V1DownloadRequest,
  V1DownloadRequestList
> {
  constructor(readonly k8sCustomObjectService: K8sCustomObjectService) {
    super(k8sCustomObjectService, Resources.DOWNLOAD_REQUEST);
  }
}
