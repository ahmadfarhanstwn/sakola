import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../user/entity/user.entity';
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

  async signIn(user: any): Promise<any> {
    const payload = { sub: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
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
}
