import {
  Controller,
  Post,
  Get,
  ValidationPipe,
  Body,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginTokenDto } from './dto/login-token.dto';
import { TokenResponse } from './interfaces/token-response';
import { RegisterResponse } from './interfaces/register-response';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    userDto: RegisterUserDto
  ): Promise<RegisterResponse> {
    try {
      return await this.authService.registerUser(userDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @Public()
  async login(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    userDto: LoginUserDto
  ): Promise<TokenResponse> {
    try {
      return await this.authService.login(userDto);
    } catch (e) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Email or password incorrect',
      });
    }
  }

  @Post('google')
  @Public()
  async loginGoogle(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    tokenDto: LoginTokenDto
  ): Promise<TokenResponse> {
    try {
      return await this.authService.loginGoogle(tokenDto);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'Google login failed',
      });
    }
  }

  @Post('facebook')
  @Public()
  async loginFacebook(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    tokenDto: LoginTokenDto
  ): Promise<TokenResponse> {
    try {
      return await this.authService.loginFacebook(tokenDto);
    } catch (e) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        error:
          e.name === 'StatusCodeError'
            ? e.error.error.message
            : 'Facebook login failed',
      });
    }
  }

  @Get('validate')
  @HttpCode(204)
  validate(): void {
    // Valida el token
  }
}
