import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../models/user/entity/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private otpCode;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mailService: MailerService,
    private jwtService: JwtService,
  ) {
    this.otpCode = Math.floor(10000 + Math.random() * 90000);
  }

  async sendConfirmationEmail(user: any) {
    const { email, full_name } = user;
    await this.mailService.sendMail({
      to: email,
      subject: 'Verify your account to use Sakola!',
      template: 'confirm',
      context: {
        full_name,
        code: this.otpCode,
      },
    });
  }

  async sendConfirmedEnail(user: UserEntity) {
    const { email, full_name } = user;
    await this.mailService.sendMail({
      to: email,
      subject: 'Congrats! Your email has been verified by Sakola',
      template: 'confirmed',
      context: {
        full_name,
        email,
      },
    });
  }

  async getCookieWithAccessToken(userId: number) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '900s',
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=900s`;
  }

  async getCookieWithRefreshToken(userId: number) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=7d`;
    return { cookie, token };
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(
      { id: userId },
      { currentHashedRefreshToken },
    );
  }

  async signUp(user: UserEntity): Promise<any> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const reqBody = {
        full_name: user.full_name,
        email: user.email,
        password: hashedPassword,
        auth_confirm_token: this.otpCode,
      };
      await this.userRepository.insert(reqBody);
      await this.sendConfirmationEmail(reqBody);
      return true;
    } catch (err) {
      return new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) return null;
    const isPasswordTrue = await bcrypt.compare(password, user.password);
    if (!isPasswordTrue || !user.is_verified) return null;
    return user;
  }

  async getAccount(id: number): Promise<any> {
    const user = this.userRepository.findOneBy({ id: id });
    if (!user) return null;
    return user;
  }

  async verifyAccount(otpCode: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { auth_confirm_token: otpCode },
      });
      if (!user)
        return new HttpException(
          'Verification code has expired or not found',
          HttpStatus.UNAUTHORIZED,
        );
      await this.userRepository.update(
        { auth_confirm_token: otpCode },
        { is_verified: true, auth_confirm_token: null },
      );
      await this.sendConfirmedEnail(user);
      return true;
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUser(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async getUserIfRefreshTokenMatched(refreshToken: string, userId: number) {
    const user = await this.getUser(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) return user;
  }

  async getCookiesForLogout() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async removeRefreshToken(userId: number) {
    return await this.userRepository.update(
      { id: userId },
      { currentHashedRefreshToken: null },
    );
  }
}
