import { Global, Module } from '@nestjs/common';
import { K8sCustomObjectService } from './k8s-custom-object.service';
import { K8sCustomObjectGateway } from '@velero-ui-api/modules/k8s-custom-object/k8s-custom-object.gateway';
import { AuthModule } from '@velero-ui-api/modules/auth/auth.module';
import { CaslModule } from '@velero-ui-api/shared/modules/casl/casl.module';

@Global()
@Module({
  imports: [AuthModule, CaslModule],
  providers: [K8sCustomObjectService, K8sCustomObjectGateway],
  exports: [K8sCustomObjectService],
  controllers: [],
})
export class K8sCustomObjectModule {}
