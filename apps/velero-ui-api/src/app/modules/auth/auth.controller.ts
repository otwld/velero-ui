import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '@velero-ui-api/modules/auth/auth.service';
import { Public } from '@velero-ui-api/shared/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard(['local', 'ldap']))
  public login(@Request() req: any) {
    return this.authService.login(req);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  public googleAuthRedirect(@Request() req: any) {
    return this.authService.login(req);
  }

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  public githubAuthRedirect(@Request() req: any) {
    return this.authService.login(req);
  }

  @Get('/gitlab')
  @UseGuards(AuthGuard('gitlab'))
  public gitlabAuthRedirect(@Request() req: any) {
    return this.authService.login(req);
  }

  @Get('/microsoft')
  @UseGuards(AuthGuard('microsoft'))
  public microsoftAuthRedirect(@Request() req: any) {
    return this.authService.login(req);
  }

  @Get('/oauth')
  @UseGuards(AuthGuard('oauth'))
  public oauthAuthRedirect(@Request() req: any) {
    return this.authService.login(req);
  }
}
