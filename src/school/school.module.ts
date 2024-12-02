import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { SchoolFiles } from './entities/school-files.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([School, SchoolFiles]), UsersModule],
  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [TypeOrmModule],
})
export class SchoolModule {}
