import { V1SpecCredential } from '@velero-ui/velero';
import { IsNotEmpty, IsString } from 'class-validator';

export class V1SpecCredentialDto implements V1SpecCredential {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsString()
  name: string;
}
