import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin-dto';
import { SignUpDto } from './dto/signin-up';
import { Token } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<Token> {
    const { email } = signUpDto;
    const isUserExist = await this.userService.getByEmail(email);

    if (isUserExist) {
      throw new ConflictException(`User with ${email} already exist`);
    }

    const user = await this.userService.create(signUpDto);

    return this.signAsync(user.email, user.id);
  }

  async signIn(signInDto: SignInDto): Promise<Token> {
    const { email, password } = signInDto;

    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Wrong email or user does not exist');
    }

    const isPasswordMatched = await bcrypt.compare(password, user?.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Wrong password');
    }

    return this.signAsync(user.email, user.id);
  }

  async signAsync(email: string, userId: number): Promise<Token> {
    const payload = { id: userId, email };
    const token = await this.jwtService.signAsync(payload);

    return { token };
  }
}
