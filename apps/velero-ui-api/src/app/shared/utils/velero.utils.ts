import {VELERO} from "../modules/velero/velero.constants";


export const getApiVersion = (): string => `${VELERO.GROUP}/${VELERO.VERSION}`;
