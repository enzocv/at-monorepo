import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './database.config';

config();

const configService = new ConfigService();
const dataSource = new DataSource(getTypeOrmConfig(configService));
export default dataSource; 