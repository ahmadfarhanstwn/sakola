import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomEntity } from './classroom/entity/classroom.entity';
import { ClassMembersEntity } from './class_members/entity/class_members.entity';
import { UserEntity } from './user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        username: 'postgres',
        password: configService.get('DB_PASSWORD'),
        database: 'sakola',
        entities: [ClassMembersEntity, ClassroomEntity, UserEntity],
        autoLoadEntities: true,
      }),
    }),
  ],
})
class DatabaseModule {}

export default DatabaseModule;
