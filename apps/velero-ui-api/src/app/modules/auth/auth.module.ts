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
import { OidcStrategy } from '@velero-ui-api/modules/auth/strategies/oidc.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get('basicAuth.secret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LdapStrategy,
    OidcStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
