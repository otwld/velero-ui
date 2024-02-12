import {Global, Module} from '@nestjs/common';
import { K8sCustomObjectService } from './k8s-custom-object.service';

@Global()
@Module({
  providers: [K8sCustomObjectService],
  exports: [K8sCustomObjectService],
})
export class K8sCustomObjectModule {}
