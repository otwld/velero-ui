import { Action } from "../../enums";
import { PluralsNames } from "@velero-ui/velero";

export type UserPermission = {
  action: Action;
  subject: PluralsNames | 'all';
}

export type Subjects = PluralsNames | 'all';

export type JwtPayload = {
  sub: number;
  name: string;
  provider: string;
  email: string;
  picture: string;
  permissions: UserPermission[];
};
