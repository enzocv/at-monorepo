import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// Endpoints públicos para autenticación
	@Post('register')
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Post('login')
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	// Endpoint protegido para obtener perfil
	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req: { user: User }): User {
		return req.user;
	}
}
