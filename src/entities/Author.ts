import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { Book } from "./Book";

@Entity()
@ObjectType()
export class Author {
  @PrimaryKey()
  @Field((type) => ID)
  id!: Number;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Property({ onUpdate: (value) => new Date() })
  @Field()
  updatedAt: Date = new Date();

  @Property()
  @Field((type) => String)
  name!: string;

  @Property({ nullable: true })
  @Field((type) => Int, { nullable: true })
  age?: number;

  @OneToMany((type) => Book, (field) => field.author)
  @Field((type) => [Book])
  books = new Collection<Book>(this);
}
