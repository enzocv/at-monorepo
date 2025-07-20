import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { DataSource } from 'typeorm';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {cors: true});

	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.useGlobalInterceptors(new TransformInterceptor());

	const dataSource = app.get(DataSource);
	await dataSource.runMigrations(); // 🔥 ejecuta migraciones al iniciar

	await app.listen(3000);
}
bootstrap();
