import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SportEvent, EventLiveStatus } from '../../sports/entities/sport-event.entity';

@Injectable()
export class SportEventsService {
	constructor(
		@InjectRepository(SportEvent)
		private readonly sportEventRepository: Repository<SportEvent>,
	) {}

	async seed() {
		const events = [
			// Eventos próximos
			{
				name: 'Liga Ejemplo - Jornada 1',
				homeTeam: 'Equipo Local',
				awayTeam: 'Equipo Visitante',
				eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // mañana
				homeTeamOdds: 1.85,
				drawOdds: 3.25,
				awayTeamOdds: 4.50,
				isActive: true,
				isLive: false,
				liveStatus: EventLiveStatus.NOT_STARTED
			},
			{
				name: 'Liga Ejemplo - Jornada 2',
				homeTeam: 'Valencia',
				awayTeam: 'Villarreal',
				eventDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // en 2 días
				homeTeamOdds: 2.10,
				drawOdds: 3.40,
				awayTeamOdds: 3.20,
				isActive: true,
				isLive: false,
				liveStatus: EventLiveStatus.NOT_STARTED
			},
			{
				name: 'Liga Ejemplo - Jornada 3',
				homeTeam: 'Athletic',
				awayTeam: 'Osasuna',
				eventDate: new Date(Date.now() + 72 * 60 * 60 * 1000), // en 3 días
				homeTeamOdds: 1.95,
				drawOdds: 3.50,
				awayTeamOdds: 3.80,
				isActive: true,
				isLive: false,
				liveStatus: EventLiveStatus.NOT_STARTED
			},
			// Eventos en vivo
			{
				name: 'Liga Ejemplo - Partido en Vivo 1',
				homeTeam: 'Real Madrid',
				awayTeam: 'Barcelona',
				eventDate: new Date(),
				homeTeamOdds: 2.10,
				drawOdds: 3.50,
				awayTeamOdds: 3.20,
				isActive: true,
				isLive: true,
				currentMinute: 35,
				homeTeamScore: 2,
				awayTeamScore: 1,
				liveStatus: EventLiveStatus.FIRST_HALF
			},
			{
				name: 'Liga Ejemplo - Partido en Vivo 2',
				homeTeam: 'Atlético',
				awayTeam: 'Sevilla',
				eventDate: new Date(),
				homeTeamOdds: 1.95,
				drawOdds: 3.30,
				awayTeamOdds: 3.80,
				isActive: true,
				isLive: true,
				currentMinute: 65,
				homeTeamScore: 0,
				awayTeamScore: 0,
				liveStatus: EventLiveStatus.SECOND_HALF
			},
			{
				name: 'Liga Ejemplo - Descanso',
				homeTeam: 'Betis',
				awayTeam: 'Getafe',
				eventDate: new Date(),
				homeTeamOdds: 2.15,
				drawOdds: 3.20,
				awayTeamOdds: 3.50,
				isActive: true,
				isLive: true,
				currentMinute: 45,
				homeTeamScore: 1,
				awayTeamScore: 1,
				liveStatus: EventLiveStatus.HALF_TIME
			},
			// Eventos finalizados, cancelados o pospuestos
			{
				name: 'Liga Ejemplo - Partido Finalizado',
				homeTeam: 'Celta',
				awayTeam: 'Mallorca',
				eventDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
				homeTeamOdds: 2.00,
				drawOdds: 3.40,
				awayTeamOdds: 3.60,
				isActive: false,
				isLive: false,
				homeTeamScore: 2,
				awayTeamScore: 1,
				liveStatus: EventLiveStatus.FINISHED
			},
			{
				name: 'Liga Ejemplo - Partido Cancelado',
				homeTeam: 'Rayo',
				awayTeam: 'Almería',
				eventDate: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
				homeTeamOdds: 1.90,
				drawOdds: 3.50,
				awayTeamOdds: 3.80,
				isActive: false,
				isLive: false,
				liveStatus: EventLiveStatus.CANCELLED
			},
			{
				name: 'Liga Ejemplo - Partido Pospuesto',
				homeTeam: 'Granada',
				awayTeam: 'Cádiz',
				eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // mañana
				homeTeamOdds: 2.20,
				drawOdds: 3.30,
				awayTeamOdds: 3.40,
				isActive: false,
				isLive: false,
				liveStatus: EventLiveStatus.POSTPONED
			}
		];

		for (const event of events) {
			const exists = await this.sportEventRepository.findOne({
				where: {
					name: event.name,
					homeTeam: event.homeTeam,
					awayTeam: event.awayTeam,
				},
			});

			if (!exists) {
				await this.sportEventRepository.save(event);
			}
		}
	}
} 