import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  public validate(username: string, password: string): boolean {
    const success: boolean = this.authService.validateBasicUser(
      username,
      password
    );

    if (!success) {
      throw new UnauthorizedException();
    }
    return success;
  }
}
