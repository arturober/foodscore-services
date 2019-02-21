import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository, DeepPartial } from 'typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import * as request from 'request-promise';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ImageService } from '../commons/image/image.service';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { LoginTokenDto } from './dto/login-token.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject('JWT_KEY') private jwt_key: string,
        @Inject('JWT_EXPIRATION') private jwt_expiration: number,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly imageService: ImageService,
        private readonly userService: UsersService,
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
        const user = await this.userRepo.findOneOrFail({where: {email: userDto.email, password: userDto.password}});
        if (userDto.lat && userDto.lng) {
            user.lat = userDto.lat;
            user.lng = userDto.lng;
            await this.userRepo.update(user.id, {lat: userDto.lat, lng: userDto.lng});
        }
        if (userDto.oneSignalId) {
            user.oneSignalId = userDto.oneSignalId;
            await this.userRepo.update(user.id, {oneSignalId: userDto.oneSignalId});
        }
        return this.createToken(user);
    }

    async loginGoogle(tokenDto: LoginTokenDto) {
        const client = new OAuth2Client('557331834920-vj2qta552qlmdbdsm5meh1lpl0dd2sod.apps.googleusercontent.com');
        const ticket = await client.verifyIdToken({
            idToken: tokenDto.token,
            audience: '557331834920-vj2qta552qlmdbdsm5meh1lpl0dd2sod.apps.googleusercontent.com',
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        let user = await this.userService.getUserbyEmail(email);
        const avatar = await this.imageService.downloadImage('users', payload.picture);
        if (!user) {
            const user2 = {
                email,
                name: payload.name,
                avatar,
                lat: tokenDto.lat ? tokenDto.lat : 0,
                lng: tokenDto.lng ? tokenDto.lng : 0,
            };
            await this.userRepo.save(user2);
            user = await this.userService.getUserbyEmail(email);
        } else if (tokenDto.lat && tokenDto.lng) {
            user.lat = tokenDto.lat;
            user.lng = tokenDto.lng;
            await this.userRepo.update(user.id, {lat: tokenDto.lat, lng: tokenDto.lng});
        }
        if (tokenDto.oneSignalId) {
            user.oneSignalId = tokenDto.oneSignalId;
            await this.userRepo.update(user.id, {oneSignalId: tokenDto.oneSignalId});
        }
        return this.createToken(user as User);
    }

    async loginFacebook(tokenDto: LoginTokenDto) {
        const options = {
            method: 'GET',
            uri: 'https://graph.facebook.com/me',
            qs: {
                access_token: tokenDto.token,
                fields: 'id,name,email',
            },
            json: true,
        };
        const respUser = await request(options);

        let user: DeepPartial<User> = await this.userService.getUserbyEmail(respUser.email);

        if (!user) {
            const optionsImg = {
                method: 'GET',
                uri: 'https://graph.facebook.com/me/picture',
                qs: {
                    access_token: tokenDto.token,
                    type: 'large',
                },
            };
            const respImg = request(optionsImg);
            const avatar = await this.imageService.downloadImage('users', respImg.url);
            user = {
                email: respUser.email,
                name: respUser.name,
                avatar,
                lat: tokenDto.lat ? tokenDto.lat : 0,
                lng: tokenDto.lng ? tokenDto.lng : 0,
            };
            user = await this.userRepo.save(user);
        } else if (tokenDto.lat && tokenDto.lng) {
            user.lat = tokenDto.lat;
            user.lng = tokenDto.lng;
            await this.userRepo.update(user.id, {lat: tokenDto.lat, lng: tokenDto.lng});
        }
        if (tokenDto.oneSignalId) {
            user.oneSignalId = tokenDto.oneSignalId;
            await this.userRepo.update(user.id, {oneSignalId: tokenDto.oneSignalId});
        }

        return this.createToken(user as User);
    }
}
