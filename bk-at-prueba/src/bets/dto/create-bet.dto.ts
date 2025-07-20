import { IsEnum, IsNumber, IsUUID, Min } from 'class-validator';
import { BetType } from '../entities/bet.entity';

export class CreateBetDto {
	@IsUUID()
	sportEventId: string;

	@IsEnum(BetType)
	betType: BetType;

	@IsNumber()
	@Min(0.1)
	amount: number;
} 