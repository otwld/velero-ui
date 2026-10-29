import { Controller, Get, Query, Req } from '@nestjs/common';
import type { AppAbility } from '../../shared/modules/casl/casl-ability.factory';
import { SearchDto } from '../../shared/dto/search.dto';
import { AuthService } from '../auth/auth.service';
import { PodVolumeListService } from './pod-volume-list.service';
import { podVolumePermissions } from './pod-volume-list.permissions';

@Controller('pod-volumes')
export class PodVolumeListController {
  constructor(
    private readonly lists: PodVolumeListService,
    private readonly auth: AuthService
  ) {}
  @Get('backups')
  backups(
    @Query() search: SearchDto,
    @Req() request: { ability?: AppAbility }
  ) {
    return this.lists.get(
      true,
      search,
      podVolumePermissions(true, request.ability, this.auth.noAuthRequired())
    );
  }
  @Get('restores')
  restores(
    @Query() search: SearchDto,
    @Req() request: { ability?: AppAbility }
  ) {
    return this.lists.get(
      false,
      search,
      podVolumePermissions(false, request.ability, this.auth.noAuthRequired())
    );
  }
}
