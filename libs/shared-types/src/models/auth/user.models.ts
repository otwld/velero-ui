import { Action } from "../../enums";
import { ResourcesNames } from "@velero-ui/velero";

export type UserPermission = {
  action: Action;
  subject: ResourcesNames | 'all';
}

export type Subjects = ResourcesNames | 'all';

export type JwtPayload = {
  sub: number;
  name: string;
  provider: string;
  email: string;
  picture: string;
  permissions: UserPermission[];
};
