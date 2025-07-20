import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BetsService } from './bets.service';
import { BetsController } from './bets.controller';
import { Bet } from './entities/bet.entity';
import { SportsModule } from '../sports/sports.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Bet]),
		SportsModule,
	],
	providers: [BetsService],
	controllers: [BetsController],
})
export class BetsModule {} 