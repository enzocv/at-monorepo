import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { SportsModule } from './sports/sports.module';
import { SportEvent } from './sports/entities/sport-event.entity';
import { BetsModule } from './bets/bets.module';
import { Bet } from './bets/entities/bet.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DATABASE_HOST'),
				port: +configService.get('DATABASE_PORT'),
				username: configService.get('DATABASE_USER'),
				password: configService.get('DATABASE_PASSWORD'),
				database: configService.get('DATABASE_NAME'),
				entities: [User, SportEvent, Bet],
				synchronize: true, // Solo usar en desarrollo
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		SportsModule,
		BetsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
