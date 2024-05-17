import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { TodoService } from 'src/todo/todo.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private todoService: TodoService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;

    const saltRounds = 10;
    const password = createUserDto.password;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    user.password = hash;
    return this.userRepository.save(user);
  }

  getByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  getById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<boolean> {
    await this.todoService.deleteAll();
    const res = await this.userRepository.delete(id);
    return Boolean(res.affected);
  }
}
