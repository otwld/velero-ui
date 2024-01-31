import { VELERO } from '../constants/velero.constants';

export const getApiVersion = (): string => `${VELERO.GROUP}/${VELERO.VERSION}`;
