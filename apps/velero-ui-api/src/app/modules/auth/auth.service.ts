import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationException } from '@velero-ui-api/shared/exceptions/authentication.exception';
import { CaslAbilityFactory } from '@velero-ui-api/shared/modules/casl/casl-ability.factory';
import { Action, UserPermission } from '@velero-ui/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) {}

  public noAuthRequired(): boolean {
    return (
      !this.configService.get<boolean>('basicAuth.enabled', { infer: true }) &&
      !this.configService.get<boolean>('github.enabled', { infer: true }) &&
      !this.configService.get<boolean>('gitlab.enabled', { infer: true }) &&
      !this.configService.get<boolean>('google.enabled', { infer: true }) &&
      !this.configService.get<boolean>('microsoft.enabled', { infer: true }) &&
      !this.configService.get<boolean>('oauth.enabled', { infer: true }) &&
      !this.configService.get<boolean>('ldap.enabled', { infer: true })
    );
  }

  public validateBasicUser(username: string, password: string): boolean {
    const {
      enabled,
      username: basicUsername,
      password: basicPassword,
    } = this.configService.get('basicAuth');

    return enabled && username === basicUsername && password === basicPassword;
  }

  public login(req) {
    if (!req.user) {
      throw new AuthenticationException('Invalid user', {
        cause: AuthService.name,
      });
    }

    console.log(req.user.policy)

    const permissions: UserPermission[] = [];

    if (req.user.provider === 'local') {
      permissions.push({ action: Action.Manage, subject: 'all' });
    } else {
      permissions.push(
        ...this.caslAbilityFactory.getPermissionsForUser(
          req.user.policy?.user,
          req.user.policy?.groups
        )
      );
    }

    const payload = {
      sub: req.user.id,
      email: req.user.email,
      name: req.user.displayName,
      picture: req.user.picture,
      provider: req.user.provider,
      permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
