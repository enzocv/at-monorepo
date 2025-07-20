import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			useFactory: () => ({
				secret: process.env.JWT_SECRET || 'tu_secreto_super_secreto',
				signOptions: {
					expiresIn: '1d',
				},
			}),
		}),
	],
	providers: [AuthService, JwtStrategy],
	controllers: [AuthController],
	exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
