import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	async register(registerDto: RegisterDto) {
		const { email, password } = registerDto;

		// Verificar si el usuario ya existe
		const userExists = await this.userRepository.findOne({
			where: { email },
		});

		if (userExists) {
			throw new UnauthorizedException('El usuario ya existe');
		}

		// Crear el usuario
		const user = this.userRepository.create({
			email,
			password: await bcrypt.hash(password, 10),
		});

		await this.userRepository.save(user);

		// Generar el token
		const token = this.generateToken(user);

		return {
			user,
			token,
		};
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;

		// Buscar el usuario
		const user = await this.userRepository.findOne({
			where: { email },
		});

		if (!user) {
			throw new UnauthorizedException('Credenciales inválidas');
		}

		// Verificar la contraseña
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Credenciales inválidas');
		}

		// Generar el token
		const token = this.generateToken(user);

		return {
			user,
			token,
		};
	}

	private generateToken(user: User) {
		const payload = { email: user.email, sub: user.id };
		return this.jwtService.sign(payload);
	}
}
