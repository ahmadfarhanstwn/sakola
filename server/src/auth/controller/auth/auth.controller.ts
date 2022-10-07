import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Response,
  Request,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';
import { UserEntity } from '../../../models/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import JwtRefreshGuard from '../../jwt_refresh.guard';
import { RequestWithUser } from '../../request_with_user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  async signUp(@Body() user: UserEntity) {
    return await this.authService.signUp(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signIn(@Request() request: RequestWithUser) {
    const { user } = request;
    const accessToken = await this.authService.getCookieWithAccessToken(
      user.id,
    );
    const refreshToken = await this.authService.getCookieWithRefreshToken(
      user.id,
    );

    await this.authService.setCurrentRefreshToken(refreshToken.token, user.id);
    request.res.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);
    return user;
  }

  @Post('verify-account')
  async verifyAccount(@Body() body) {
    return await this.authService.verifyAccount(body.code);
  }

  @Get(':id')
  async getOne(@Response() res, @Param() param) {
    const user = await this.authService.getUser(param.id);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({});
    return res.status(HttpStatus.OK).json({ user });
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh-token')
  async refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = await this.authService.getCookieWithAccessToken(
      request.user.id,
    );
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() request: RequestWithUser) {
    await this.authService.removeRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      await this.authService.getCookiesForLogout(),
    );
  }
}
