import { Controller, Get, Req, Param, ParseIntPipe, UseGuards, NotFoundException, Put, Body, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    getCurrentUser(@Req() req) {
        let user = req.user;
        user.me = true;
        return { user };
    }

    @Get(':id')
    async getUser(
        @Req() req,
        @Param('id', ParseIntPipe) id: number
    ) {
        try {
            let user = await this.usersService.getUser(id);
            (<any>user).me = user.id == req.user.id;
            return { user };
        } catch (e) {
            throw new NotFoundException();
        }
    }

    @Put('me')
    async updateUserInfo(
        @Req() req,
        @Body(new ValidationPipe({ transform: true })) userDto: UpdateUserDto) {
        try {
            await this.usersService.updateUserInfo(req.user.id, userDto);
            return { ok: true };
        } catch (e) {
            throw new NotFoundException();
        }
    }

    @Put('me/password')
    async updatePassword(
        @Req() req,
        @Body(new ValidationPipe({ transform: true })) passDto: UpdatePasswordDto) {
        try {
            await this.usersService.updatePassword(req.user.id, passDto);
            return { ok: true };
        } catch (e) {
            throw new NotFoundException();
        }
    }

    @Put('me/avatar')
    async updateAvatar(@Req() req,
        @Body(new ValidationPipe({ transform: true })) avatarDto: UpdateAvatarDto) {
        try {
            const avatar = await this.usersService.updateAvatar(req.user.id, avatarDto);
            return { avatar };
        } catch (e) {
            throw new NotFoundException();
        }

    }
}
