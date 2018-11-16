import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ImageService } from 'commons/image.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject('JWT_KEY') private jwt_key: string,
        @Inject('JWT_EXPIRATION') private jwt_expiration: number,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly imageService: ImageService,
    ) { }

    private createToken(user: User) {
        const data: JwtPayload = {
            id: user.id,
        };
        const expiresIn = this.jwt_expiration;
        const accessToken = jwt.sign(data, this.jwt_key, { expiresIn });
        return {
            expiresIn,
            accessToken,
        };
    }

    async registerUser(userDto: RegisterUserDto) {
        userDto.avatar = await this.imageService.saveImage('users', userDto.avatar);
        await this.userRepo.insert(userDto);
        return userDto;
    }

    async login(userDto: LoginUserDto) {
        const user = await this.userRepo.findOneOrFail({email: userDto.email, password: userDto.password});
        if (userDto.lat && userDto.lng) {
            user.lat = userDto.lat;
            user.lng = userDto.lng;
            await this.userRepo.save(user);
        }
        return this.createToken(user);
    }
}
