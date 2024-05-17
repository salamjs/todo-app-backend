import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { TodoModule } from 'src/todo/todo.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TodoModule],
  providers: [UserService, JwtService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
