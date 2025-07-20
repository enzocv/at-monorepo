import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {
		const options: StrategyOptions = {
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET || 'tu_secreto_super_secreto',
		};
		super(options);
	}

	async validate(payload: { sub: string; email: string }) {
		const { sub: id } = payload;
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) throw new UnauthorizedException('Token no válido');
		if (!user.isActive) throw new UnauthorizedException('Usuario inactivo');
		return user;
	}
}
