import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { SportsService } from './sports.service';
import { CreateSportEventDto } from './dto/create-sport-event.dto';
import { UpdateSportEventDto } from './dto/update-sport-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sports')
export class SportsController {
	constructor(private readonly sportsService: SportsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Body() createSportEventDto: CreateSportEventDto) {
		return this.sportsService.create(createSportEventDto);
	}

	// Endpoint público para ver eventos
	@Get()
	findAll() {
		return this.sportsService.findAll();
	}

	// Endpoint público para ver un evento específico
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.sportsService.findOne(id);
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard)
	update(@Param('id') id: string, @Body() updateSportEventDto: UpdateSportEventDto) {
		return this.sportsService.update(id, updateSportEventDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	remove(@Param('id') id: string) {
		return this.sportsService.remove(id);
	}
} 