import { PartialType } from '@nestjs/mapped-types';
import { CreateSportEventDto } from './create-sport-event.dto';

export class UpdateSportEventDto extends PartialType(CreateSportEventDto) {} 