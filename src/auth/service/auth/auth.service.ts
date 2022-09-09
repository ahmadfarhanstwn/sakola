import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../user/entity/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../../dto/login.dto';

@Injectable()
export class AuthService {
  private otpCode;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private mailService: MailerService,
  ) {
    this.otpCode = Math.floor(10000 + Math.random() * 90000);
  }

  async sendConfirmationEmail(user: any) {
    const { email, full_name } = user;
    await this.mailService.sendMail({
      to: email,
      subject: "Welcome to Sakola! Let's confirm your email to use this app!",
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
      subject:
        'Congrats! Your email has been verified! Sakola will treat you better further!',
      template: 'confirmed',
      context: {
        full_name,
        email,
      },
    });
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
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(user: LoginDto, jwt: JwtService): Promise<any> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (!foundUser)
        return new HttpException(
          "You haven't create an account with your email",
          HttpStatus.UNAUTHORIZED,
        );
      const isPasswordTrue = await bcrypt.compare(
        user.password,
        foundUser.password,
      );
      if (!foundUser.is_verified)
        return new HttpException(
          "Your account hasn't been verified! Please verify your account",
          HttpStatus.UNAUTHORIZED,
        );
      if (!isPasswordTrue)
        return new HttpException(
          'Your password is incorrect',
          HttpStatus.UNAUTHORIZED,
        );
      const payload = { email: user.email };
      return {
        token: jwt.sign(payload),
      };
    } catch (error) {
      return new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
}
