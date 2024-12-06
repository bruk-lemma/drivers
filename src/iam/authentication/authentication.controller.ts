import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
import { ApiExcludeEndpoint, ApiResponse } from '@nestjs/swagger';
import { SignInResponseDto } from './dto/sign-in-response.dto/sign-in-response.dto';
import { ApiResponseDto } from 'src/school/dto/api-response.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto/sign-up-response.dto';
import { Role } from 'src/users/entities/role.entity';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiResponse({
    status: 201,
    description: 'Sign up',
    type: SignInResponseDto,
  })
  @Post('sign-up')
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<ApiResponseDto<SignUpResponseDto>> {
    const user = await this.authenticationService.signUp(signUpDto);
    return new ApiResponseDto(user, 'User created successfully');
  }

  @ApiResponse({
    status: 200,
    description: 'Sign in',
    type: SignInResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signin(@Body() signInDto: SignInDto) {
    return await this.authenticationService.signIn(signInDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Sign in',
    type: SignInResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authenticationService.refreshTokens(refreshTokenDto);
  }

  @ApiExcludeEndpoint()
  @Get('check-permission')
  async checkPermission(
    @Query('userId') userId: number,
    @Query('resource') resource: string,
    @Query('action') action: string,
  ): Promise<{ hasPermission: boolean }> {
    const hasPermission = await this.authenticationService.checkPermission(
      userId,
      resource,
      action,
    );

    if (!hasPermission) {
      throw new UnauthorizedException('User does not have permission');
    }

    return { hasPermission };
  }

  @Get('user/:id')
  async getUser(
    @Param('id') id: number,
  ): Promise<ApiResponseDto<SignUpResponseDto>> {
    const user = await this.authenticationService.getUser(id);
    return new ApiResponseDto(user, 'User fetched successfully');
  }

  @Post('user/:id/change-role')
  async changeUserRole(
    @Param('id') id: number,
    @Body('role') role: string,
  ): Promise<ApiResponseDto<SignUpResponseDto>> {
    const user = await this.authenticationService.changeUserRole(id, role);
    return new ApiResponseDto(user, 'User role updated successfully');
  }

  @Get('roles')
  async findRoles(): Promise<ApiResponseDto<Role[]>> {
    const roles = await this.authenticationService.findRoles();
    return new ApiResponseDto(roles, 'Roles fetched successfully');
  }
}
