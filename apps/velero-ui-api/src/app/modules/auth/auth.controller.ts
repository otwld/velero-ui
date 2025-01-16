import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '@velero-ui-api/modules/auth/auth.service';
import { Public } from '@velero-ui-api/shared/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard(['local', 'ldap']))
  public login(@Req() req: Request) {
    return this.authService.login(req);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  public googleAuthRedirect(@Req() req: Request) {
    return this.authService.login(req);
  }

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  public githubAuthRedirect(@Req() req: Request) {
    return this.authService.login(req);
  }

  @Get('/gitlab')
  @UseGuards(AuthGuard('gitlab'))
  public gitlabAuthRedirect(@Req() req: Request) {
    return this.authService.login(req);
  }

  @Get('/microsoft')
  @UseGuards(AuthGuard('microsoft'))
  public microsoftAuthRedirect(@Req() req: Request) {
    return this.authService.login(req);
  }

  @Get('/oauth')
  @UseGuards(AuthGuard('oauth'))
  public oauthAuthRedirect(@Req() req: Request) {
    return this.authService.login(req);
  }
}
