import { IsEnum, IsUUID, IsString, IsOptional } from 'class-validator';
import { BetStatus } from '../entities/bet.entity';

export class UpdateBetStatusDto {
    @IsUUID()
    betId: string;

    @IsEnum(BetStatus)
    status: BetStatus;

    @IsString()
    @IsOptional()
    refundReason?: string;
} 