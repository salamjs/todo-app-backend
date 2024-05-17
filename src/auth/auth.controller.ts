import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Token } from './auth.types';
import { SignUpDto } from './dto/signin-up';
import { AuthResponse } from './auth.response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @ApiOperation({ summary: 'Логин', operationId: 'signin' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AuthResponse,
  })
  signIn(@Body() signInDto: SignInDto): Promise<Token> {
    return this.authService.signIn(signInDto);
  }

  @Post('/signup')
  @ApiOperation({ summary: 'Регистрация', operationId: 'signup' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AuthResponse,
  })
  signUp(@Body() signInDto: SignInDto): Promise<Token> {
    return this.authService.signUp(signInDto);
  }
}
