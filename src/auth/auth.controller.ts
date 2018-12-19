import {
  Controller,
  Post,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Res,
  HttpStatus,
  ConflictException,
  HttpException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Res() res: Response, @Body() userDto: RegisterUserDto) {
    try {
      const user = await this.authService.registerUser(userDto);
      res.status(HttpStatus.CREATED).send(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() userDto: LoginUserDto) {
    try {
      return await this.authService.login(userDto);
    } catch (e) {
      throw new UnauthorizedException('Email or password incorrect');
    }
  }

  @Get('validate')
  @UseGuards(AuthGuard('jwt'))
  validate() {
    // Valida el token
    return { ok: true };
  }
}
