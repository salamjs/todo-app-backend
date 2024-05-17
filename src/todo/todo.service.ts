import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestService } from 'src/services/request.service';
import { TodoStatus } from './todo.types';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private readonly requestService: RequestService,
  ) {}

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = new Todo();
    todo.title = createTodoDto.title;
    todo.description = createTodoDto.description;
    todo.createdBy = this.requestService.getUser();
    return this.todoRepository.save(todo);
  }

  findOne(id: number): Promise<Todo> {
    return this.todoRepository.findOneBy({
      id,
    });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const userId = this.requestService.getUser().id;
    const todo = await this.findOne(id);

    if (Object.values(updateTodoDto).length === 0) {
      throw new BadRequestException('');
    }

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    this.throwExceptionIfUserNotAuthor(todo.createdBy.id, userId);

    Object.assign(todo, updateTodoDto);

    return this.todoRepository.save(todo);
  }

  async delete(id: number) {
    const userId = this.requestService.getUser().id;
    const todo = await this.findOne(id);

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    this.throwExceptionIfUserNotAuthor(todo.createdBy.id, userId);

    const res = await this.todoRepository.delete({ id });

    return Boolean(res.affected);
  }

  async deleteAll() {
    const userId = this.requestService.getUser().id;
    const todos = await this.todoRepository.find({
      where: { createdBy: { id: userId } },
    });

    return this.todoRepository.remove(todos);
  }

  throwExceptionIfUserNotAuthor(authorId: number, userId: number) {
    if (authorId !== userId) {
      throw new HttpException(
        'You are not the author of the todo',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  findAllByStatus(status: TodoStatus): Promise<Todo[]> {
    const userId = this.requestService.getUser().id;

    return this.todoRepository.find({
      where: {
        createdBy: { id: userId },
        status,
      },
    });
  }
}
