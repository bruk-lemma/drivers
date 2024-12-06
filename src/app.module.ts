import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { LicenseModule } from './license/license.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApplicationModule } from './application/application.module';
import { ExaminationModule } from './examination/examination.module';
import { ensureDatabaseExists } from './create-db';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CoffeesModule,
    UsersModule,
    IamModule,
    TypeOrmModule.forRootAsync({
      // inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionOptions = {
          type: process.env.DB_TYPE as any,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT as any,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          autoLoadEntities: true,
          synchronize: true, //
        };

        // Ensure database exists before connecting//
        await ensureDatabaseExists(connectionOptions);

        return connectionOptions;
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // This will make files available at http://localhost:3000/uploads
    }),
    SchoolModule,
    StudentModule,
    LicenseModule,
    ApplicationModule,
    ExaminationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
