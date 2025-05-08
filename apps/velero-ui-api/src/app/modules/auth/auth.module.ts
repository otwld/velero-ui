import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from '@velero-ui-api/modules/auth/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';
import { JwtStrategy } from '@velero-ui-api/modules/auth/strategies/jwt.strategy';
import { LdapStrategy } from '@velero-ui-api/modules/auth/strategies/ldap.strategy';
import { GoogleStrategy } from '@velero-ui-api/modules/auth/strategies/google.strategy';
import { GithubStrategy } from '@velero-ui-api/modules/auth/strategies/github.strategy';
import { GitlabStrategy } from '@velero-ui-api/modules/auth/strategies/gitlab.strategy';
import { MicrosoftStrategy } from '@velero-ui-api/modules/auth/strategies/microsoft.strategy';
import { OauthStrategy } from '@velero-ui-api/modules/auth/strategies/oauth.strategy';
import { CaslModule } from '@velero-ui-api/shared/modules/casl/casl.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get('app.secret'),
        signOptions: {
          expiresIn: configService.get('app.sessionDuration'),
        },
      }),
      inject: [ConfigService],
    }),
    CaslModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LdapStrategy,
    GoogleStrategy,
    GithubStrategy,
    GitlabStrategy,
    MicrosoftStrategy,
    OauthStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
