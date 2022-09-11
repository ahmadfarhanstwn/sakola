import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassMembersEntity } from './entity/class_members.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassMembersEntity])],
})
export class ClassMembersModule {}
