import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SportEvent } from '../../sports/entities/sport-event.entity';

export enum BetType {
	HOME = 'HOME',
	DRAW = 'DRAW',
	AWAY = 'AWAY',
}

export enum BetStatus {
	PENDING = 'PENDING',
	WON = 'WON',
	LOST = 'LOST',
	CASH_OUT = 'CASH_OUT',
	REFUNDED = 'REFUNDED'
}

@Entity('bets')
export class Bet {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => SportEvent)
	@JoinColumn({ name: 'sport_event_id' })
	sportEvent: SportEvent;

	@Column({
		type: 'enum',
		enum: BetType,
	})
	betType: BetType;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	amount: number;

	@Column({ type: 'decimal', precision: 5, scale: 2 })
	odds: number;

	@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
	potentialWin: number;

	@Column({ 
		type: 'enum',
		enum: BetStatus,
		default: BetStatus.PENDING 
	})
	status: BetStatus;

	@Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
	cashOutAmount: number;

	@Column({ type: 'timestamp', nullable: true })
	cashOutDate: Date;

	@Column({ type: 'text', nullable: true })
	refundReason: string;

	@Column({ type: 'timestamp', nullable: true })
	refundDate: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
} 