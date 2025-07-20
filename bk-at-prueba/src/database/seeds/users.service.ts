import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async seed() {
        const testUser = {
            email: 'test@example.com',
            password: await bcrypt.hash('123456', 10),
            firstName: 'Test',
            lastName: 'User',
            isActive: true
        };

        const exists = await this.userRepository.findOne({
            where: { email: testUser.email }
        });

        if (!exists) {
            await this.userRepository.save(testUser);
            console.log('Test user created successfully');
        } else {
            console.log('Test user already exists');
        }
    }
} 