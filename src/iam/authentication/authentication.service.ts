import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './configs/jwt.config';
import { CurrentUserInfo } from '../types/current-user-info.type';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import {
  InvalidatedRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage';
import { randomUUID } from 'node:crypto';
import { RefreshTokenPayload } from './types/refresh-token-payload.type';
import { OtpAuthenticationService } from './otp-authentication.service';

@Injectable()
export class AuthenticationService {
  public constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    private readonly otpAuthService: OtpAuthenticationService,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.email = signUpDto.email;
      user.password = await this.hashingService.hash(signUpDto.password);
      await this.usersRepository.save(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = '23505';
      if (err.code === pgUniqueViolationErrorCode)
        throw new ConflictException();
      throw err;
    }
  }

  public async generateTokens(user: User) {
    const refreshTokenId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<CurrentUserInfo>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: user.email, role: user.role, permissions: user.permissions },
      ),
      this.signToken<Pick<RefreshTokenPayload, 'refreshTokenId'>>(
        user.id,
        this.jwtConfiguration.refreshTokenTtl,
        {
          refreshTokenId,
        },
      ),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return { accessToken, refreshToken };
  }

  public async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOneBy({
      email: signInDto.email,
    });
    if (!user) throw new UnauthorizedException('User does not exist');

    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) throw new UnauthorizedException('Password does not match');

    // Check if TFA is enabled and the TFA code is valid
    if (user.isTfaEnabled) {
      if (!signInDto.tfaCode)
        throw new UnauthorizedException('2FA code must be provided');

      const isValid = this.otpAuthService.verifyCode(
        signInDto.tfaCode,
        user.tfaSecret,
      );

      if (!isValid) throw new UnauthorizedException('Invalid 2FA code');
    }

    const tokens = await this.generateTokens(user);

    return tokens;
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const {
        sub,
        refreshTokenId: refreshTokenIdToCheck,
      }: RefreshTokenPayload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );

      const user = await this.usersRepository.findOneByOrFail({ id: sub });

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenIdToCheck,
      );

      if (isValid) await this.refreshTokenIdsStorage.invalidate(user.id);
      else throw new Error('Refresh token is invalid');

      const tokens = await this.generateTokens(user);

      return tokens;
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError)
        throw new UnauthorizedException('Access denied');

      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );

    return accessToken;
  }
}
