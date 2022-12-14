import { Module } from '@nestjs/common';
import { AuthService } from './service/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthController } from './controller/auth/auth.controller';
import { UserService } from '../models/user/service/user/user.service';
import { UserModule } from '../models/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../models/user/entity/user.entity';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt_refresh_token.strategy';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: '90457a87c1ac62',
          pass: 'cd636d546ac55f',
        },
      },
      defaults: {
        from: '"Sakola" <verify@sakola.com>',
      },
      template: {
        dir: join(__dirname, '../src/views/email-templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
