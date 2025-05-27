import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { CurrentUser } from '../decorators/active-user.decorator';
import { CurrentUserInfo } from '../types/current-user-info.type';
import { Response } from 'express';
import { OtpAuthenticationService } from './otp-authentication.service';
import { toFileStream } from 'qrcode';
import { GoogleAuthenticatonService } from './social/google-authenticaton.service';
import { GoogleTokenDto } from './dtos/google-token.dto';

@Auth(AuthType.None)
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly othAuthService: OtpAuthenticationService,
    private readonly googleAuthService: GoogleAuthenticatonService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshTokens(refreshTokenDto);
  }

  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateQrCode(
    @CurrentUser() currentUser: CurrentUserInfo,
    @Res() response: Response,
  ) {
    const { secret, uri } = await this.othAuthService.generateSecret(
      currentUser.email,
    );

    await this.othAuthService.enableTfaForUser(currentUser.email, secret);

    response.type('png');

    return toFileStream(response, uri);
  }

  @Post('google')
  async googleAuthenticate(@Body() tokenDto: GoogleTokenDto) {
    return this.googleAuthService.authenticate(tokenDto.token);
  }
}
