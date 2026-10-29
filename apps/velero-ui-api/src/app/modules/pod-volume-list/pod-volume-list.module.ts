import { VolumeOperationsService } from './volume-operations.service';
import { VolumeOperationsController } from './volume-operations.controller';
import { VolumeOperationsGateway } from './volume-operations.gateway';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CaslModule } from '../../shared/modules/casl/casl.module';
import { K8sCustomObjectModule } from '../k8s-custom-object/k8s-custom-object.module';
import { PodVolumeListService } from './pod-volume-list.service';
import { PodVolumeListController } from './pod-volume-list.controller';
import { PodVolumeListGateway } from './pod-volume-list.gateway';
@Module({
  imports: [AuthModule, CaslModule, K8sCustomObjectModule],
  controllers: [PodVolumeListController, VolumeOperationsController],
  providers: [
    PodVolumeListService,
    PodVolumeListGateway,
    VolumeOperationsService,
    VolumeOperationsGateway,
  ],
})
export class PodVolumeListModule {}
