import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoStatus } from './todo.types';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Todo } from './entities/todo.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('todo')
@ApiBearerAuth()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Создание todo', operationId: 'create' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Todo,
  })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Изменение todo по id', operationId: 'update' })
  @ApiBody({ type: UpdateTodoDto })
  @ApiParam({ name: 'id', required: true, description: 'Идентификатор todo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Todo,
  })
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todoService.update(Number(id), updateTodoDto);
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Удаление todo по id', operationId: 'delete' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Идентификатор todo',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Boolean,
  })
  delete(@Param('id') id: string): Promise<boolean> {
    return this.todoService.delete(Number(id));
  }

  @Get('/list/:status')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Получение списка todo по статусу',
    operationId: 'getListByStatus',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Todo,
    isArray: true,
  })
  @ApiParam({
    name: 'status',
    required: true,
    enum: TodoStatus,
    description: 'Статус todo',
  })
  findAllByStatus(@Param('status') status: TodoStatus): Promise<Todo[]> {
    return this.todoService.findAllByStatus(status);
  }
}
