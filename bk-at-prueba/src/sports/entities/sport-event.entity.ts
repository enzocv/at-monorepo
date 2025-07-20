import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EventLiveStatus {
	NOT_STARTED = 'NOT_STARTED',
	FIRST_HALF = 'FIRST_HALF',
	HALF_TIME = 'HALF_TIME',
	SECOND_HALF = 'SECOND_HALF',
	FINISHED = 'FINISHED',
	CANCELLED = 'CANCELLED',
	POSTPONED = 'POSTPONED'
}

@Entity('sport_events')
export class SportEvent {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	homeTeam: string;

	@Column()
	awayTeam: string;

	@Column({ type: 'timestamp' })
	eventDate: Date;

	@Column({ type: 'decimal', precision: 5, scale: 2, default: 1.00 })
	homeTeamOdds: number;

	@Column({ type: 'decimal', precision: 5, scale: 2, default: 1.00 })
	drawOdds: number;

	@Column({ type: 'decimal', precision: 5, scale: 2, default: 1.00 })
	awayTeamOdds: number;

	@Column({ default: true })
	isActive: boolean;

	@Column({ nullable: true })
	result: string;

	@Column({ default: false })
	isLive: boolean;

	@Column({ nullable: true })
	currentMinute: number;

	@Column({ default: 0 })
	homeTeamScore: number;

	@Column({ default: 0 })
	awayTeamScore: number;

	@Column({
		type: 'enum',
		enum: EventLiveStatus,
		default: EventLiveStatus.NOT_STARTED
	})
	liveStatus: EventLiveStatus;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
} 