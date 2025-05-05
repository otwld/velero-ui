import { Global, Module } from '@nestjs/common';
import { K8sCustomObjectService } from './k8s-custom-object.service';
import { K8sCustomObjectGateway } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.gateway';
import { K8sCustomObjectController } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.controller';
import { AuthModule } from '@velero-ui-api/modules/auth/auth.module';

@Global()
@Module({
  imports: [AuthModule],
  providers: [K8sCustomObjectService, K8sCustomObjectGateway],
  exports: [K8sCustomObjectService],
  controllers: [K8sCustomObjectController],
})
export class K8sCustomObjectModule {}
