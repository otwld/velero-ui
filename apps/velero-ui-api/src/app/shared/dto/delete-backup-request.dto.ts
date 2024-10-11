import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeleteBackupRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
