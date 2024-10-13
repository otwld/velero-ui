import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationException } from '@velero-ui-api/shared/exceptions/authentication.exception'; // import {AppLogger} from "@velero-ui-api/shared/modules/logger/logger.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

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

    const payload = {
      sub: req.user.id,
      email: req.user.email,
      name: req.user.displayName,
      picture: req.user.picture,
      provider: req.user.provider,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
