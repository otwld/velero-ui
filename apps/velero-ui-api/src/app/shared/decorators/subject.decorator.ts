import { SetMetadata } from '@nestjs/common';
import { ResourcesNames } from "@velero-ui/velero";

export const SUBJECT_KEY = 'subject';
export const Subject = (resource: ResourcesNames) => SetMetadata(SUBJECT_KEY, resource);
