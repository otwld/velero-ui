import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AppLogger } from '@velero-ui-api/shared/modules/logger/logger.service';
import { Action } from '@velero-ui/shared-types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private logger: AppLogger,
    private readonly authService: AuthService
  ) {
    super();
  }

  public validate(username: string, password: string) {
    this.logger.debug(
      `Try to validate local user ${username} with password ****...`,
      LocalStrategy.name
    );

    const success: boolean = this.authService.validateBasicUser(
      username,
      password
    );

    if (!success) {
      return null;
    }

    this.logger.info(`Local user signed in.`, LocalStrategy.name);

    return {
      id: 'local',
      provider: 'local',
      displayName: username,
      permissions: [{ action: Action.Manage, subject: 'all' }],
    };
  }
}
