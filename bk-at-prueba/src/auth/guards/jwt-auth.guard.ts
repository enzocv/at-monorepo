import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CanActivate } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {}
