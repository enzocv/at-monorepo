import { IsUUID } from 'class-validator';

export class CashOutBetDto {
    @IsUUID()
    betId: string;
} 