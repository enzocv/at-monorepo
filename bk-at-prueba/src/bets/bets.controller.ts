import { Controller, Get, Post, Body, Param, UseGuards, Request, UnauthorizedException, Put } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { CashOutBetDto } from './dto/cash-out-bet.dto';
import { UpdateBetStatusDto } from './dto/update-bet-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Bet } from './entities/bet.entity';

@Controller('bets')
@UseGuards(JwtAuthGuard)
export class BetsController {
	constructor(private readonly betsService: BetsService) {}

	@Post()
	create(@Body() createBetDto: CreateBetDto, @Request() req): Promise<Bet> {
		if (!req.user || !req.user.id) {
			throw new UnauthorizedException('Usuario no autenticado');
		}
		return this.betsService.create(createBetDto, req.user);
	}

	@Post('cash-out')
	async cashOut(@Body() cashOutBetDto: CashOutBetDto, @Request() req): Promise<Bet> {
		if (!req.user || !req.user.id) {
			throw new UnauthorizedException('Usuario no autenticado');
		}
		return this.betsService.cashOut(cashOutBetDto, req.user.id);
	}

	@Put('status')
	async updateStatus(@Body() updateBetStatusDto: UpdateBetStatusDto): Promise<Bet> {
		return this.betsService.updateStatus(updateBetStatusDto);
	}

	@Get()
	findAll(@Request() req): Promise<Bet[]> {
		if (!req.user || !req.user.id) {
			throw new UnauthorizedException('Usuario no autenticado');
		}
		return this.betsService.findAllByUser(req.user.id);
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Request() req): Promise<Bet> {
		if (!req.user || !req.user.id) {
			throw new UnauthorizedException('Usuario no autenticado');
		}
		return this.betsService.findOne(id, req.user.id);
	}
} 