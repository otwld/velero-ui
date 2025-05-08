import { Action } from '@velero-ui/shared-types';
import { ResourceList } from '@velero-ui/velero';

export const isValidPermission = (action: string, subject: string): boolean => {
  return (
    Object.values(Action).includes(action as Action) &&
    [...ResourceList, 'all'].includes(subject)
  );
};
