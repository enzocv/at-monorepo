import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportEvent } from '../../sports/entities/sport-event.entity';
import { User } from '../../users/entities/user.entity';
import { SportEventsService } from './sport-events.service';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		DatabaseModule,
		TypeOrmModule.forFeature([SportEvent, User]),
	],
	providers: [SportEventsService, UsersService],
	exports: [SportEventsService, UsersService],
})
export class SeedsModule {} 