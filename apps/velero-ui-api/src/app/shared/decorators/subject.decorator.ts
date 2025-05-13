import { SetMetadata } from '@nestjs/common';
import { PluralsNames } from "@velero-ui/velero";

export const SUBJECT_KEY = 'subject';
export const Subject = (resource: PluralsNames) => SetMetadata(SUBJECT_KEY, resource);
