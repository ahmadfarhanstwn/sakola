import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/entity/user.entity';
import { AuthController } from './auth/controller/auth/auth.controller';
import { AuthService } from './auth/service/auth/auth.service';
import { UserService } from './user/service/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        username: 'postgres',
        password: process.env.DB_PASSWORD,
        database: 'sakola',
        entities: [UserEntity],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AppModule {}
