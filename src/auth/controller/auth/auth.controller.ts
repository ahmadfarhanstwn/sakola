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
} from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';
import { UserEntity } from '../../../user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/signup')
  async signUp(@Body() user: UserEntity) {
    return await this.authService.signUp(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async signIn(@Request() request) {
    return await this.authService.signIn(request.user);
  }

  @Post('/verify')
  async verifyAccount(@Body() body) {
    return await this.authService.verifyAccount(body.code);
  }

  @Get('/:id')
  async getOne(@Response() res, @Param() param) {
    const user = await this.authService.getUser(param.id);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({});
    return res.status(HttpStatus.OK).json({ user });
  }
}
