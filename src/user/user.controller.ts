import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Получение текущего пользователя',
    operationId: 'getProfile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: User,
  })
  getProfile(@Request() req: any): User {
    if (req.user.iat) delete req.user.iat;
    return req.user;
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Удаление аккаунта', operationId: 'delete' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: Boolean,
  })
  delete(@Request() req: any): Promise<boolean> {
    return this.userService.delete(req.user.id);
  }
}
