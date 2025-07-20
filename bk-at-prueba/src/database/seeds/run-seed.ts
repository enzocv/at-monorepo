import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds.module';
import { SportEventsService } from './sport-events.service';
import { UsersService } from './users.service';

async function bootstrap() {
	const app = await NestFactory.create(SeedsModule);

	try {
		// Crear usuario de prueba
		const userSeeder = app.get(UsersService);
		await userSeeder.seed();
		console.log('User seeding completed');

		// Crear eventos deportivos
		const eventSeeder = app.get(SportEventsService);
		await eventSeeder.seed();
		console.log('Sport events seeding completed');

		console.log('All seeding completed successfully');
	} catch (error) {
		console.error('Seeding failed:', error);
	} finally {
		await app.close();
	}
}

bootstrap(); 