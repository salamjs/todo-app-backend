import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { User } from '../user/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class RequestService {
  constructor(
    @Inject(REQUEST) private readonly request: Request & { user: User },
  ) {}

  getUser(): User {
    return this.request.user;
  }
}
