import { Body, Controller, Post } from '@nestjs/common';
import { PocketBaseService } from '../pocketbase.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RecordModel } from 'pocketbase';

@Controller('auth')
export class AuthController {
  constructor(private readonly pbService: PocketBaseService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<any> {
    try {
      const record = await this.pbService.client.collection('_pb_users').create({
        email: signupDto.email,
        password: signupDto.password,
        passwordConfirm: signupDto.passwordConfirm,
      });
      return { message: 'User created', user: record };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      const authData = await this.pbService.client.collection('_pb_users').authWithPassword(loginDto.email, loginDto.password);
      return { message: 'Login successful', token: authData.token, user: authData.record };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
