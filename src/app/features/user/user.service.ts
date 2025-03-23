import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from '@features/user/repository/user.repository';
import {PasswordService} from '@shared/services/password-service.service';
import {CreateUserDto} from '@features/user/dto/create-user.dto';
import {JWTPayload, Tokens} from '@features/user/model/verifyToken.model';
import {LoginUserDto} from '@features/user/dto/login-user.dto';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto): Promise<Tokens> {
    const existingUser = await this.userRepository.getUserByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException(`Email already exists.`);
    }

    const hashedPassword = await this.passwordService.hashPassword(dto.password);
    dto.password = hashedPassword;

    const createdUser = await this.userRepository.createUser(dto);

    const payload = {
      user_id: createdUser.id,
    };
    const tokens = await this.getTokens(payload);
    await this.updateRtHash(tokens.refresh_token as string, createdUser.id);
    return tokens;
  }

  async login(dto: LoginUserDto): Promise<Tokens | {access_token: string}> {
    const existingUser = await this.userRepository.getUserByEmail(dto.email);
    if (!existingUser) {
      throw new NotFoundException(`Account not found`);
    }

    const isValidPassword = await this.passwordService.comparePasswords(dto.password, existingUser.password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials!');
    }

    const payload = {
      user_id: existingUser.id,
    };
    const tokens = await this.getTokens(payload);

    if (dto.isRemember) {
      await this.updateRtHash(tokens.refresh_token as string, existingUser.id);
      return tokens;
    }

    return {access_token: tokens.access_token};
  }

  async refreshTokens(user: any): Promise<Tokens> {
    const payload = {
      user_id: user.id,
    };
    const tokens = await this.getTokens(payload);
    return tokens;
  }

  async logout(user: any): Promise<void> {
    await this.userRepository.removeRefreshToken(user.id);
  }

  async getTokens(payload: any): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_AT_SECRET'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async verifyAccessToken(token: string): Promise<any> {
    try {
      const jwtSecret = this.configService.get<string>('JWT_AT_SECRET');
      const decodedPayload = await this.jwtService.verifyAsync<JWTPayload>(token, {
        secret: jwtSecret,
      });
      const user = await this.userRepository.getUserById(decodedPayload.user_id);

      if (!user) {
        throw new UnauthorizedException('Account Not Found');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid Access Token');
    }
  }

  async verifyRefreshToken(token: string): Promise<any> {
    try {
      const jwtSecret = this.configService.get<string>('JWT_RT_SECRET');

      const decodedPayload = await this.jwtService.verifyAsync<JWTPayload>(token, {
        secret: jwtSecret,
      });

      const user = await this.userRepository.getUserWithToken(decodedPayload.user_id);

      if (!user) {
        throw new UnauthorizedException('Account Not Found');
      }

      // Check if the token exists in the user's refresh tokens
      const storedToken = user.refreshTokens.find(rt => rt.tokenHash === token);

      if (!storedToken) {
        throw new UnauthorizedException('Invalid Refresh Token');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
  }

  async updateRtHash(token: string, userId: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, token);
  }
}
