import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
      server: {
        url: configService.get('ldap.url'),
        bindDN: configService.get('ldap.bindDn'),
        bindCredentials: configService.get('ldap.bindCredentials'),
        searchBase: configService.get('ldap.searchBase'),
        searchFilter: configService.get('ldap.searchFilter'),
        searchAttributes: configService.get('ldap.searchAttributes'),
      },
    }, async (req: Request, user, done) => {
        console.log("Passport LDAP authentication.");
        console.log(user)
       done(null, user);
    });
  }

  public validate(req: Request, username: string, password: string): boolean {
    /*const success: boolean = this.authService.validateBasicUser(
      username,
      password
    );

    if (!success) {
      throw new UnauthorizedException();
    }*/
    console.log(req)
    console.log('user:' + username);
    console.log('passw:' + password);
    return false;
  }
}
