import { IsString, IsNotEmpty, IsDate, IsNumber, Min, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EventLiveStatus } from '../entities/sport-event.entity';

export class CreateSportEventDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	homeTeam: string;

	@IsString()
	@IsNotEmpty()
	awayTeam: string;

	@Type(() => Date)
	@IsDate()
	eventDate: Date;

	@IsNumber()
	@Min(1)
	homeTeamOdds: number;

	@IsNumber()
	@Min(1)
	drawOdds: number;

	@IsNumber()
	@Min(1)
	awayTeamOdds: number;

	@IsOptional()
	@IsBoolean()
	isLive?: boolean;

	@IsOptional()
	@IsNumber()
	@Min(0)
	currentMinute?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	homeTeamScore?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	awayTeamScore?: number;

	@IsOptional()
	@IsEnum(EventLiveStatus)
	liveStatus?: EventLiveStatus;
} 