import { IsString } from 'class-validator';

export class CreateDeleteBackRequestDto {
  @IsString()
  name: string;

  @IsString()
  namespace: string;
}
