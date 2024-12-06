import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user.data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage/refresh-token-ids.storage';
import { randomUUID } from 'crypto';
import { plainToInstance } from 'class-transformer';
import { SignInResponseDto } from './dto/sign-in-response.dto/sign-in-response.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto/sign-up-response.dto';
import { Role } from 'src/users/entities/role.entity';
// import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,

    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponseDto> {
    try {
      const role = await this.roleRepository.findOneOrFail({
        where: { id: signUpDto.roleId },
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      const user = new Users();
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);
      user.role = role;
      await this.userRepository.save(user);
      return this.mapEntityToDto(user);
    } catch (error) {
      const pgUniqueViolationCode = '23505';
      if (error.code === pgUniqueViolationCode) {
        throw new ConflictException();
        //throw error;
      }
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordCorrect = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException("password doesn't match");
    }

    return await this.generateTokens(user);
  }

  async generateTokens(user: Users) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email, role: user.role, userId: user.id }, //, permissions: user.permissions },
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return plainToInstance(SignInResponseDto, { accessToken, refreshToken });
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        // expiresIn: this.jwtConfiguration.accessTokenTtl,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      console.log('refretokenid', refreshTokenId);
      const user = await this.userRepository.findOneByOrFail({ id: sub });
      const isRefreshTokenValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );
      console.log('isRefreshTokenValid', isRefreshTokenValid);
      if (isRefreshTokenValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      return this.generateTokens(user);
    } catch (err) {
      console.log('error is' + err.message);

      if (err instanceof InvalidatedRefreshTokenError) {
        //take action notify user that his refresh token might be stolen?
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  async checkPermission(
    userId: number,
    resource: string,
    action: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['permissions'], // Only select the permissions field to optimize the query
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user.permissions.some(
      (permission) =>
        permission.resource === resource && permission.action === action,
    );
  }

  async getUser(id: number): Promise<SignUpResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.mapEntityToDto(user);
    } catch (error) {
      throw error;
    }
  }

  async changeUserRole(id: number, role: string): Promise<SignUpResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.role = Role[role];

      await this.userRepository.save(user);
      return this.mapEntityToDto(user);
    } catch (error) {
      throw error;
    }
  }

  async findRoles(): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.find();
      return roles;
    } catch (error) {
      throw error;
    }
  }

  private mapEntityToDto(user: Users): SignUpResponseDto {
    const signUpResponseDto = new SignUpResponseDto();
    signUpResponseDto.email = user.email;
    signUpResponseDto.id = user.id;
    signUpResponseDto.role = user.role;
    return signUpResponseDto;
  }
}
