import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './iam/authorization/decorators/roles.decorators';
import { Role } from './users/enums/role.enum';
import { AuthType } from './iam/authentication/enums/auth-type.enum';
import { Auth } from './iam/authentication/decorators/auth.decorator';

@Controller()
@Auth(AuthType.Bearer)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles(Role.Admin) //
  getHello(): string {
    return this.appService.getHello();
  }
}
