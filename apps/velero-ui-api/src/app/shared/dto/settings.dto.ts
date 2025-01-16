import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ImagePullPolicyEnum } from '@velero-ui/shared-types';

export class AddVeleroPluginDTO {
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsOptional()
  @IsEnum(ImagePullPolicyEnum)
  imagePullPolicy: ImagePullPolicyEnum;
}
