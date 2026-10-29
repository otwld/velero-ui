import { ForbiddenException } from '@nestjs/common';
import { Action, type PodVolumeListPermissions } from '@velero-ui/shared-types';
import { Resources } from '@velero-ui/velero';
import type { AppAbility } from '../../shared/modules/casl/casl-ability.factory';

export function podVolumePermissions(
  backup: boolean,
  ability: AppAbility | undefined,
  noAuth: boolean
): PodVolumeListPermissions {
  const can = (
    plural:
      | typeof Resources.RESTORE.plural
      | typeof Resources.POD_VOLUME_BACKUP.plural
      | typeof Resources.POD_VOLUME_RESTORE.plural
      | typeof Resources.DATA_UPLOAD.plural
      | typeof Resources.DATA_DOWNLOAD.plural
  ) => noAuth || !!ability?.can(Action.Read, plural);
  const permissions = {
    filesystem: can(
      backup
        ? Resources.POD_VOLUME_BACKUP.plural
        : Resources.POD_VOLUME_RESTORE.plural
    ),
    mover: can(
      backup ? Resources.DATA_UPLOAD.plural : Resources.DATA_DOWNLOAD.plural
    ),
    restores: !backup && can(Resources.RESTORE.plural),
  };
  if (!permissions.filesystem && !permissions.mover)
    throw new ForbiddenException();
  return permissions;
}
