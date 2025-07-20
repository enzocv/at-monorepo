import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportEvent } from './entities/sport-event.entity';
import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';

@Module({
	imports: [TypeOrmModule.forFeature([SportEvent])],
	providers: [SportsService],
	controllers: [SportsController],
	exports: [SportsService],
})
export class SportsModule {}
