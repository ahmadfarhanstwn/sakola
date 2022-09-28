import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../../auth/controller/auth/auth.controller';
import { AuthService } from '../../auth/service/auth/auth.service';
import { UserEntity } from './entity/user.entity';
import { UserService } from './service/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [UserService, AuthService],
  controllers: [AuthController],
})
export class UserModule {}
