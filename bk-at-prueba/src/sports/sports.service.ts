import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SportEvent } from './entities/sport-event.entity';
import { CreateSportEventDto } from './dto/create-sport-event.dto';
import { UpdateSportEventDto } from './dto/update-sport-event.dto';

@Injectable()
export class SportsService {
	constructor(
		@InjectRepository(SportEvent)
		private readonly sportEventRepository: Repository<SportEvent>,
	) {}

	async create(createSportEventDto: CreateSportEventDto): Promise<SportEvent> {
		const event = this.sportEventRepository.create(createSportEventDto);
		return await this.sportEventRepository.save(event);
	}

	async findAll(): Promise<SportEvent[]> {
		return await this.sportEventRepository.find({
			where: { isActive: true },
			order: { eventDate: 'ASC' },
		});
	}

	async findOne(id: string): Promise<SportEvent> {
		const event = await this.sportEventRepository.findOne({
			where: { id },
		});

		if (!event) {
			throw new NotFoundException('Evento deportivo no encontrado');
		}

		return event;
	}

	async update(id: string, updateSportEventDto: UpdateSportEventDto): Promise<SportEvent> {
		const event = await this.findOne(id);
		Object.assign(event, updateSportEventDto);
		return await this.sportEventRepository.save(event);
	}

	async remove(id: string): Promise<void> {
		const event = await this.findOne(id);
		event.isActive = false;
		await this.sportEventRepository.save(event);
	}
}
