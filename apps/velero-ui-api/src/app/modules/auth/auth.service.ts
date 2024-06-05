import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
// import {AppLogger} from "@velero-ui-api/shared/modules/logger/logger.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
  }

  public validateBasicUser(username: string, password: string): boolean {
    const {
      enabled,
      username: basicUsername,
      password: basicPassword,
    } = this.configService.get('basicAuth');

    return enabled && username === basicUsername && password === basicPassword;
  }

  public login(username: string) {
    const payload = {name: username, sub: 'local'};

    // this.appLogger.debug(`Admin login: ${username}`);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
