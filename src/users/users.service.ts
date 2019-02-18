import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { ImageService } from '../commons/image/image.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly imageService: ImageService,
    ) { }

    async getUser(id: number): Promise<User> {
        return this.userRepo.findOneOrFail(id);
    }

    async getUserbyEmail(email: string): Promise<User> {
        return this.userRepo.findOne({email});
    }

    async emailExists(email: string): Promise<boolean> {
        return (await this.userRepo.findOne({email})) ? true : false;
    }

    async updateUserInfo(id: number, user: UpdateUserDto): Promise<void> {
        await this.userRepo.update(id, user);
    }

    async updatePassword(id: number, pass: UpdatePasswordDto): Promise<void> {
        await this.userRepo.update(id, pass);
    }

    async updateAvatar(id: number, avatar: UpdateAvatarDto): Promise<string> {
        avatar.avatar = await this.imageService.saveImage('users', avatar.avatar);
        await this.userRepo.update(id, avatar);
        return avatar.avatar;
    }
}
