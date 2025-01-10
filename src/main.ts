import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Accept requests from all domains
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(new LoggerMiddleware().use);
  const config = new DocumentBuilder()
    .setTitle('Genesis API')
    .setDescription('The Genesis API description')
    .setVersion('1.0')
    .addTag('genesis')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());
  //app.useGlobalValidationPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    }),
  );
  // Run Seeding Logic
  const seedService = app.get(SeedService); // Get the SeedService
  await seedService.seed(); // Run the seeding logic
  app.use(bodyParser.json({ limit: '10mb' })); // Set to your desired limit
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(3000);
}
bootstrap();
