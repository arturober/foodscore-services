import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({length: 100})
    name: string;

    @Column({length: 2000})
    description: string;

    @Column('simple-array')
    daysOpen: string[];

    @Column({length: 20})
    phone: string;

    @Column({length: 100})
    image: string;

    @Column({length: 100})
    address: string;

    @Column('simple-array')
    cuisine: string[];

    @Column({type: 'decimal', default: 0, precision: 4, scale: 2})
    stars: number;

    @Column({type: 'decimal', default: 0, precision: 10, scale: 7})
    lat: number;

    @Column({type: 'decimal', default: 0, precision: 10, scale: 7})
    lng: number;

    @ManyToOne(type => User, user => user.restCreated, {nullable: false, cascade: true, onDelete: "CASCADE"})
    creator: User;

    @OneToMany(type => Comment, com => com.restaurant)
    comments: Comment[];
}