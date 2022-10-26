import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ length: 200, nullable: false })
  name!: string;

  @Property({ length: 250, nullable: false })
  email!: string;

  @Property({ length: 100, nullable: false })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Property({ length: 250, nullable: false })
  avatar!: string;

  @Property({ columnType: 'double', nullable: false })
  lat!: number;

  @Property({ columnType: 'double', nullable: false })
  lng!: number;

  @Property({ length: 200, nullable: true })
  @Exclude({ toPlainOnly: true })
  firebaseToken?: string;

  @Property({ persist: false })
  me?: boolean;
}
