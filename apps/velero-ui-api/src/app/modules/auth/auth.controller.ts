import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@velero-ui-api/modules/auth/auth.service';
import { Public } from '@velero-ui-api/shared/decorators/public.decorator';
import {AuthGuard} from "@nestjs/passport";

@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  public login(@Body() body) {
    return this.authService.login(body.username);
  }
}
