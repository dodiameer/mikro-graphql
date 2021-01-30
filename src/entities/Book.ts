import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";
import { Author } from "./Author";

@Entity()
@ObjectType()
export class Book {
  @PrimaryKey()
  @Field((type) => ID)
  id!: number;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Property({ onUpdate: (value) => new Date() })
  @Field()
  updatedAt: Date = new Date();

  @Property()
  @Field((type) => String)
  title!: string;

  @ManyToOne((type) => Author)
  @Field((type) => Author)
  author!: Author;
}
