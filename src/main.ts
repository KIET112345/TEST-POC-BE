import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from 'common/filters/global-exception.filter';

async function bootstrap() {
  const logger = new Logger('Boostrap');
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.enableVersioning({
      type: VersioningType.URI,
    });

    const swaggerConfig = new DocumentBuilder()
      .setTitle('POC BackEnd API')
      .setDescription('API is being used for testing reservations')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`App is running on port: ${port}`);
  } catch (error) {
    logger.error('Error during start up app ', error);
    process.exit(1);
  }
}
void bootstrap();
