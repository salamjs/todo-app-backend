import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TodoStatus } from '../todo.types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  @ApiPropertyOptional({
    enum: TodoStatus,
    enumName: 'TodoStatus',
  })
  status?: TodoStatus;
}
