import { Test, TestingModule } from '@nestjs/testing';
import { BetsService } from './bets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet, BetType, BetStatus } from './entities/bet.entity';
import { SportEvent, EventLiveStatus } from '../sports/entities/sport-event.entity';
import { SportsService } from '../sports/sports.service';
import { User } from '../users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BetsService', () => {
    let service: BetsService;
    let betRepository: Repository<Bet>;
    let sportsService: SportsService;

    const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword123',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    } as User;

    const mockSportEvent = {
        id: '1',
        name: 'Test Event',
        homeTeam: 'Home Team',
        awayTeam: 'Away Team',
        eventDate: new Date(),
        homeTeamOdds: 2.0,
        drawOdds: 3.0,
        awayTeamOdds: 4.0,
        isActive: true,
        isLive: true,
        currentMinute: 30,
        homeTeamScore: 1,
        awayTeamScore: 0,
        liveStatus: EventLiveStatus.FIRST_HALF,
        createdAt: new Date(),
        updatedAt: new Date()
    } as SportEvent;

    const mockBet = {
        id: '1',
        user: mockUser,
        sportEvent: mockSportEvent,
        betType: BetType.HOME,
        amount: 100,
        odds: 2.0,
        potentialWin: 200,
        status: BetStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
    } as Bet;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BetsService,
                {
                    provide: getRepositoryToken(Bet),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        find: jest.fn(),
                    },
                },
                {
                    provide: SportsService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<BetsService>(BetsService);
        betRepository = module.get<Repository<Bet>>(getRepositoryToken(Bet));
        sportsService = module.get<SportsService>(SportsService);
    });

    describe('create', () => {
        it('should create a bet for a live event', async () => {
            const createBetDto = {
                sportEventId: '1',
                betType: BetType.HOME,
                amount: 100,
            };

            jest.spyOn(sportsService, 'findOne').mockResolvedValue(mockSportEvent);
            jest.spyOn(betRepository, 'create').mockReturnValue(mockBet);
            jest.spyOn(betRepository, 'save').mockResolvedValue(mockBet);

            const result = await service.create(createBetDto, mockUser);

            expect(result).toBeDefined();
            expect(result.amount).toBe(100);
            expect(result.betType).toBe(BetType.HOME);
            expect(result.status).toBe(BetStatus.PENDING);
        });

        it('should throw BadRequestException for finished events', async () => {
            const createBetDto = {
                sportEventId: '1',
                betType: BetType.HOME,
                amount: 100,
            };

            const finishedEvent = {
                ...mockSportEvent,
                liveStatus: EventLiveStatus.FINISHED,
            };

            jest.spyOn(sportsService, 'findOne').mockResolvedValue(finishedEvent);

            await expect(service.create(createBetDto, mockUser)).rejects.toThrow(BadRequestException);
        });
    });

    describe('cashOut', () => {
        it('should perform cash out successfully', async () => {
            const cashOutDto = {
                betId: '1',
            };

            const pendingBet = {
                ...mockBet,
                status: BetStatus.PENDING,
            };

            jest.spyOn(betRepository, 'findOne').mockResolvedValue(pendingBet);
            jest.spyOn(betRepository, 'save').mockImplementation((bet) => Promise.resolve(bet as Bet));

            const result = await service.cashOut(cashOutDto, mockUser.id);

            expect(result.status).toBe(BetStatus.CASH_OUT);
            expect(result.cashOutAmount).toBeDefined();
            expect(result.cashOutDate).toBeDefined();
        });

        it('should throw NotFoundException for non-existent bet', async () => {
            const cashOutDto = {
                betId: 'non-existent',
            };

            jest.spyOn(betRepository, 'findOne').mockResolvedValue(null);

            await expect(service.cashOut(cashOutDto, mockUser.id)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException for non-pending bets', async () => {
            const cashOutDto = {
                betId: '1',
            };

            const completedBet = {
                ...mockBet,
                status: BetStatus.WON,
            };

            jest.spyOn(betRepository, 'findOne').mockResolvedValue(completedBet);

            await expect(service.cashOut(cashOutDto, mockUser.id)).rejects.toThrow(BadRequestException);
        });
    });

    describe('updateStatus', () => {
        it('should update bet status successfully', async () => {
            const updateStatusDto = {
                betId: '1',
                status: BetStatus.WON,
            };

            const pendingBet = { ...mockBet, status: BetStatus.PENDING };
            jest.spyOn(betRepository, 'findOne').mockResolvedValue(pendingBet);
            jest.spyOn(betRepository, 'save').mockImplementation((bet) => Promise.resolve(bet as Bet));

            const result = await service.updateStatus(updateStatusDto);

            expect(result.status).toBe(BetStatus.WON);
        });

        it('should handle refund with reason', async () => {
            const updateStatusDto = {
                betId: '1',
                status: BetStatus.REFUNDED,
                refundReason: 'Event cancelled',
            };

            const pendingBet = { ...mockBet, status: BetStatus.PENDING };
            jest.spyOn(betRepository, 'findOne').mockResolvedValue(pendingBet);
            jest.spyOn(betRepository, 'save').mockImplementation((bet) => Promise.resolve(bet as Bet));

            const result = await service.updateStatus(updateStatusDto);

            expect(result.status).toBe(BetStatus.REFUNDED);
            expect(result.refundReason).toBe('Event cancelled');
            expect(result.refundDate).toBeDefined();
        });

        it('should throw BadRequestException for refund without reason', async () => {
            const updateStatusDto = {
                betId: '1',
                status: BetStatus.REFUNDED,
            };

            const pendingBet = { ...mockBet, status: BetStatus.PENDING };
            jest.spyOn(betRepository, 'findOne').mockResolvedValue(pendingBet);

            await expect(service.updateStatus(updateStatusDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAllByUser', () => {
        it('should return all bets for a user', async () => {
            const bets = [mockBet, { ...mockBet, id: '2' }];
            jest.spyOn(betRepository, 'find').mockResolvedValue(bets);

            const result = await service.findAllByUser(mockUser.id);

            expect(result).toHaveLength(2);
            expect(result[0].user.id).toBe(mockUser.id);
        });
    });

    describe('findOne', () => {
        it('should return a specific bet', async () => {
            jest.spyOn(betRepository, 'findOne').mockResolvedValue(mockBet);

            const result = await service.findOne(mockBet.id, mockUser.id);

            expect(result).toBeDefined();
            expect(result.id).toBe(mockBet.id);
        });

        it('should throw NotFoundException for non-existent bet', async () => {
            jest.spyOn(betRepository, 'findOne').mockResolvedValue(null);

            await expect(service.findOne('non-existent', mockUser.id)).rejects.toThrow(NotFoundException);
        });
    });
}); 