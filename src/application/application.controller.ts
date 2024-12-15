import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/updateapplication.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user.data.interface';

@Controller('application')
@Auth(AuthType.None)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Auth(AuthType.Bearer)
  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    console.log(user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.applicationService.create(user.userId, createApplicationDto);
  }

  @Get()
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.applicationService.update(
      +id,
      user.userId,
      updateApplicationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }

  @Patch(':id/update-status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateApplicationStatus(
      +id,
      updateApplicationStatusDto,
    );
  }
}
