import { Action } from '@velero-ui/shared-types';
import { PLURALS } from '@velero-ui/velero';

export const isValidPermission = (action: string, subject: string): boolean => {
  return (
    Object.values(Action).includes(action as Action) &&
    [...PLURALS, 'all'].includes(subject)
  );
};
