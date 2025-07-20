import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;
    let userRepository: Repository<User>;

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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('test-token'),
                    },
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('register', () => {
        it('should successfully register a new user', async () => {
            const registerDto = {
                email: 'new@example.com',
                password: 'password123',
                firstName: 'New',
                lastName: 'User',
            };

            const mockNewUser = {
                ...registerDto,
                id: '2',
                isActive: true,
                password: 'hashedPassword',
                createdAt: new Date(),
                updatedAt: new Date()
            } as User;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(userRepository, 'create').mockReturnValue(mockNewUser);
            jest.spyOn(userRepository, 'save').mockResolvedValue(mockNewUser);

            const result = await service.register(registerDto);

            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.token).toBe('test-token');
            expect(userRepository.findOne).toHaveBeenCalled();
            expect(userRepository.create).toHaveBeenCalled();
            expect(userRepository.save).toHaveBeenCalled();
        });

        it('should throw UnauthorizedException if user already exists', async () => {
            const registerDto = {
                email: 'existing@example.com',
                password: 'password123',
                firstName: 'Existing',
                lastName: 'User',
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

            await expect(service.register(registerDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('login', () => {
        it('should successfully login a user', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

            const result = await service.login(loginDto);

            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
            expect(result.token).toBe('test-token');
            expect(userRepository.findOne).toHaveBeenCalled();
        });

        it('should throw UnauthorizedException if user not found', async () => {
            const loginDto = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if user is not active', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            const inactiveUser = { ...mockUser, isActive: false } as User;
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(inactiveUser);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });
}); 