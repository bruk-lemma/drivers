import {
  Body,
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
import * as nodemailer from 'nodemailer';
import { plainToInstance } from 'class-transformer';
import { SignInResponseDto } from './dto/sign-in-response.dto/sign-in-response.dto';
import { SignUpResponseDto } from './dto/sign-up-response.dto/sign-up-response.dto';
import { Role } from 'src/users/entities/role.entity';
import {
  Reset_And_Verification_Token,
  TokenType,
} from 'src/users/entities/tokens.entity';
import { ResetPasswordDto } from './dto/reset-password.dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto/forget-password.sto';
// import { Role } from 'src/users/enums/role.enum';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Reset_And_Verification_Token)
    private readonly tokenRepository: Repository<Reset_And_Verification_Token>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const role = await this.roleRepository.findOne({
        where: { id: signUpDto.roleId },
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }
      const user = new Users();
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);
      user.role = role;
      console.log('user is ' + user);
      await this.userRepository.save(user);
      console.log('user is' + user);
      return this.mapEntityToDto(user);
    } catch (error) {
      const pgUniqueViolationCode = '23505';
      if (error.code === pgUniqueViolationCode) {
        throw new ConflictException();
        //throw error;
      }
      throw error;
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

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    try {
      const user = await this.userRepository.findOneBy({
        email: forgetPasswordDto.email,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      //send email with reset password link
      const generateSixDigitToken = (): string => {
        return Math.floor(100000 + Math.random() * 900000).toString();
      };
      const verificationToken = generateSixDigitToken();

      const hashedToken = await this.hashingService.hash(verificationToken);
      const tokenExpires = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes

      const resetToken = new Reset_And_Verification_Token();
      resetToken.token = hashedToken;
      resetToken.expiresAt = tokenExpires;
      resetToken.user = user;
      resetToken.type = TokenType.RESET;
      resetToken.isAcitve = true;

      await this.tokenRepository.save(resetToken);
      try {
        await this.sendEmail(
          user.email,
          'Reset password',
          `Your reset password token is ${verificationToken}`,
        );
      } catch (error) {
        throw new Error(`Email not sent, ${error.message}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: resetPasswordDto.email },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const hashedToken = await this.hashingService.hash(
        resetPasswordDto.token,
      );
      const resetToken = await this.tokenRepository.findOneBy({
        //token: hashedToken,
        type: TokenType.RESET,
        isAcitve: true,
        isUsed: false,
        user: { id: user.id },
      });

      if (!resetToken) {
        throw new NotFoundException('Token not found');
      }

      const tokenIsValid = await this.hashingService.compare(
        resetPasswordDto.token,
        resetToken.token,
      );

      if (!tokenIsValid) {
        throw new UnauthorizedException('Invalid token');
      }

      if (resetToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Token expired');
      }

      // const user = resetToken.user;
      user.password = await this.hashingService.hash(
        resetPasswordDto.newPassword,
      );
      await this.userRepository.save(user);
      resetToken.isUsed = true;
      resetToken.isAcitve = false;
      await this.tokenRepository.save(resetToken);
      return 'Password reset successfully';
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bruklemma2017@gmail.com',
          pass: 'qaalvvwroltbgozy',
        },
      });

      await transporter.sendMail({
        from: '"Genesis App" <no-reply@example.com>', // Sender address
        to, // Recipient email
        subject, // Email subject
        text: body, // Plain text body
        html: `<p>${body}</p>`, // HTML body
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      throw error;
    }
  }
}
