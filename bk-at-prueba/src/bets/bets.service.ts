import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet, BetType, BetStatus } from './entities/bet.entity';
import { CreateBetDto } from './dto/create-bet.dto';
import { CashOutBetDto } from './dto/cash-out-bet.dto';
import { UpdateBetStatusDto } from './dto/update-bet-status.dto';
import { User } from '../users/entities/user.entity';
import { SportEvent, EventLiveStatus } from '../sports/entities/sport-event.entity';
import { SportsService } from '../sports/sports.service';

@Injectable()
export class BetsService {
	constructor(
		@InjectRepository(Bet)
		private readonly betRepository: Repository<Bet>,
		private readonly sportsService: SportsService,
	) {}

	async create(createBetDto: CreateBetDto, user: User): Promise<Bet> {
		const sportEvent = await this.sportsService.findOne(createBetDto.sportEventId);

		// Validar estados no permitidos para apuestas
		const invalidStates = [
			EventLiveStatus.FINISHED,
			EventLiveStatus.CANCELLED,
			EventLiveStatus.POSTPONED
		];

		if (invalidStates.includes(sportEvent.liveStatus)) {
			throw new BadRequestException(`No se pueden realizar apuestas en eventos ${sportEvent.liveStatus.toLowerCase()}`);
		}

		// Si el evento no es en vivo y ya pasó la fecha, no permitir apuestas
		if (!sportEvent.isLive && new Date() >= sportEvent.eventDate) {
			throw new BadRequestException('No se pueden realizar apuestas para eventos que ya han comenzado y no están en vivo');
		}

		// Formatear el monto a 2 decimales
		const amount = Number(createBetDto.amount.toFixed(2));

		// Obtener las cuotas según el tipo de apuesta
		let odds: number;
		switch (createBetDto.betType) {
			case BetType.HOME:
				odds = +sportEvent.homeTeamOdds;
				break;
			case BetType.DRAW:
				odds = +sportEvent.drawOdds;
				break;
			case BetType.AWAY:
				odds = +sportEvent.awayTeamOdds;
				break;
			default:
				throw new BadRequestException('Tipo de apuesta inválido');
		}

		// Calcular la ganancia potencial y formatear a 2 decimales
		const potentialWin = Number((amount * odds).toFixed(2));

		const bet = this.betRepository.create({
			...createBetDto,
			amount,
			user,
			sportEvent,
			odds,
			potentialWin,
		});

		return await this.betRepository.save(bet);
	}

	async cashOut(cashOutBetDto: CashOutBetDto, userId: string): Promise<Bet> {
		const bet = await this.betRepository.findOne({
			where: { id: cashOutBetDto.betId, user: { id: userId } },
			relations: ['sportEvent'],
		});

		if (!bet) {
			throw new NotFoundException('Apuesta no encontrada');
		}

		if (bet.status !== BetStatus.PENDING) {
			throw new BadRequestException('Solo se puede hacer cash out de apuestas pendientes');
		}

		// Validar estados no permitidos para cash out
		const invalidStates = [
			EventLiveStatus.FINISHED,
			EventLiveStatus.CANCELLED,
			EventLiveStatus.POSTPONED
		];

		if (invalidStates.includes(bet.sportEvent.liveStatus)) {
			throw new BadRequestException(`No se puede hacer cash out en eventos ${bet.sportEvent.liveStatus.toLowerCase()}`);
		}

		// Calcular el monto del cash out (90% de la apuesta inicial)
		const CASH_OUT_PERCENTAGE = 0.90; // 90% de la apuesta inicial
		const cashOutAmount = Number((bet.amount * CASH_OUT_PERCENTAGE).toFixed(2));

		// Actualizar la apuesta
		bet.status = BetStatus.CASH_OUT;
		bet.cashOutAmount = cashOutAmount;
		bet.cashOutDate = new Date();

		return await this.betRepository.save(bet);
	}

	async updateStatus(updateBetStatusDto: UpdateBetStatusDto): Promise<Bet> {
		const bet = await this.betRepository.findOne({
			where: { id: updateBetStatusDto.betId },
			relations: ['sportEvent'],
		});

		if (!bet) {
			throw new NotFoundException('Apuesta no encontrada');
		}

		// Validar que la apuesta esté pendiente
		if (bet.status !== BetStatus.PENDING) {
			throw new BadRequestException(`No se puede actualizar una apuesta con estado ${bet.status}`);
		}

		// Validar estados permitidos
		if (![BetStatus.WON, BetStatus.LOST, BetStatus.REFUNDED].includes(updateBetStatusDto.status)) {
			throw new BadRequestException('Estado no válido para actualización manual');
		}

		// Si es un reembolso, validar que tenga razón
		if (updateBetStatusDto.status === BetStatus.REFUNDED) {
			if (!updateBetStatusDto.refundReason) {
				throw new BadRequestException('Se requiere una razón para reembolsar la apuesta');
			}
			bet.refundReason = updateBetStatusDto.refundReason;
			bet.refundDate = new Date();
		}

		bet.status = updateBetStatusDto.status;
		return await this.betRepository.save(bet);
	}

	async findAllByUser(userId: string): Promise<Bet[]> {
		return await this.betRepository.find({
			where: { user: { id: userId } },
			relations: ['sportEvent'],
			order: { createdAt: 'DESC' },
		});
	}

	async findOne(id: string, userId: string): Promise<Bet> {
		const bet = await this.betRepository.findOne({
			where: { id, user: { id: userId } },
			relations: ['sportEvent'],
		});

		if (!bet) {
			throw new NotFoundException('Apuesta no encontrada');
		}

		return bet;
	}
}
