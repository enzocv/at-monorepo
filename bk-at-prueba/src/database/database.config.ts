import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SportEvent } from '../sports/entities/sport-event.entity';
import { User } from '../users/entities/user.entity';
import { Bet } from '../bets/entities/bet.entity';

export const getTypeOrmConfig = (configService: ConfigService): DataSourceOptions => ({
	type: 'postgres',
	host: configService.get('DATABASE_HOST'),
	port: +configService.get('DATABASE_PORT'),
	username: configService.get('DATABASE_USER'),
	password: configService.get('DATABASE_PASSWORD'),
	database: configService.get('DATABASE_NAME'),
	entities: [SportEvent, User, Bet],
	migrations: ['dist/database/migrations/*.js'],
	synchronize: false,
}); 