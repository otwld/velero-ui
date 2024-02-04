import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeleteBackRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
