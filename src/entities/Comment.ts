import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { InsertCommentDto } from 'src/comments/dto/insert-comment.dto';
import { Restaurant } from './Restaurant';
import { User } from './User';

@Entity()
@Unique({ properties: ['restaurant', 'user'] })
export class Comment {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'smallint' })
  stars: number;

  @Property({ length: 1000 })
  text: string;

  @Property({ type: 'datetime', onCreate: () => new Date() })
  date?: Date;

  @ManyToOne({
    entity: () => Restaurant,
    fieldName: 'restaurant',
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    nullable: false,
  })
  restaurant: Restaurant;

  @ManyToOne({
    entity: () => User,
    fieldName: 'user',
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    nullable: false,
  })
  user: User;

  constructor(id: number, stars: number, text: string, date: Date) {
    this.id = id;
    this.stars = stars;
    this.text = text;
    this.date = date;
  }

  static fromCreateDto(commentDto: InsertCommentDto) {
    return new Comment(null, commentDto.stars, commentDto.text, null);
  }
}
