import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Comment } from './comment.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({length: 150})
    name: string;

    @Column({length: 150, unique: true})
    email: string;

    @Column({length: 150, nullable: true, select: false})
    password: string;

    @Column({length: 100, default: 'img/profile.jpg'})
    avatar: string;

    @Column({type: 'decimal', default: 0, precision: 10, scale: 7})
    lat: number;

    @Column({type: 'decimal', default: 0, precision: 10, scale: 7})
    lng: number;

    @OneToMany(type => Restaurant, rest => rest.creator)
    restCreated: Restaurant[];

    @OneToMany(type => Comment, com => com.user)
    comments: Comment[];
}