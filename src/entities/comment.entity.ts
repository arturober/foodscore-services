import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, Index, AfterInsert, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Restaurant } from './restaurant.entity';

@Entity()
@Index(['restaurant', 'user'], { unique: true })
export class Comment {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({type: 'smallint'})
    stars: number;

    @Column({length: 1000})
    text: string;

    @CreateDateColumn({type: "datetime"})
    date: Date;

    @ManyToOne(type => Restaurant, rest => rest.comments, {nullable: false, cascade: true, onDelete: "CASCADE"})
    restaurant: Restaurant;

    @ManyToOne(type => User, user => user.comments, {nullable: false, cascade: true, onDelete: "CASCADE"})
    user: User;
}
