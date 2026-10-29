import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { Action } from '@velero-ui/shared-types';
import type { AppAbility } from '../../shared/modules/casl/casl-ability.factory';
import { AuthService } from '../auth/auth.service';
import { VolumeOperationsService } from './volume-operations.service';
import {
  VolumeOperationsTargetDto,
  VolumeOperationsQueryDto,
} from './volume-operations.dto';

@Controller('pod-volumes/operations')
export class VolumeOperationsController {
  constructor(
    private readonly operations: VolumeOperationsService,
    private readonly auth: AuthService
  ) {}
  @Get(':plural/:parent')
  get(
    @Param() target: VolumeOperationsTargetDto,
    @Query() query: VolumeOperationsQueryDto,
    @Req() request: { ability?: AppAbility }
  ) {
    if (
      !this.auth.noAuthRequired() &&
      !request.ability?.can(Action.Read, target.plural as never)
    )
      throw new ForbiddenException();
    return this.operations.get(target.plural, target.parent, query.uid);
  }
}
