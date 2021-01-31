import { MutationError, MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  ID,
  Info,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { GraphQLResolveInfo } from "graphql";
import { loadRelations } from "../constants";
import { Max, MaxLength, Min } from "class-validator";
import { Author } from "../entities/Author";

@InputType()
class CreateAuthorInput {
  @Field((type) => String)
  @MaxLength(64, { message: "Name must be 64 characters or less" })
  name!: string;

  @Field((type) => Int, { nullable: true })
  @Max(110, { message: "Age must be between 16 and 110" })
  @Min(16, { message: "Age must be between 16 and 110" })
  age?: number;
}

@InputType()
class UpdateAuthorInput {
  @Field((type) => String, { nullable: true })
  @MaxLength(64, { message: "Name must be 64 characters or less" })
  name?: string;

  @Field((type) => Int, { nullable: true })
  @Max(110, { message: "Age must be between 16 and 110" })
  @Min(16, { message: "Age must be between 16 and 110" })
  age?: number;
}

@ObjectType()
class AuthorMutation {
  @Field((type) => [MutationError], { nullable: true })
  errors?: MutationError[];

  @Field((type) => Author, { nullable: true })
  author?: Author;
}

@Resolver()
export class AuthorResolver {
  @Query((type) => [Author])
  async authors(
    @Ctx() { em }: MyContext,
    @Arg("limit", (type) => Int, { nullable: true }) limit: number = 10,
    @Arg("offset", (type) => Int, { nullable: true }) offset: number = 0,
    @Info() info: GraphQLResolveInfo
  ): Promise<Author[]> {
    const authors = await em.find(
      Author,
      {},
      { limit, offset, populate: loadRelations(info) }
    );
    return authors;
  }

  @Query((type) => Int)
  async countAuthors(@Ctx() { em }: MyContext): Promise<number> {
    const count = await em.count(Author);
    return count;
  }

  @Query((type) => Author, { nullable: true })
  async author(
    @Ctx() { em }: MyContext,
    @Arg("id", (type) => ID) id: number,
    @Info() info: GraphQLResolveInfo
  ): Promise<Author | null> {
    const author = await em.findOne(
      Author,
      { id },
      { populate: loadRelations(info) }
    );
    return author;
  }

  @Mutation((type) => AuthorMutation)
  async createAuthor(
    @Ctx() { em }: MyContext,
    @Arg("input", (type) => CreateAuthorInput) input: CreateAuthorInput
  ): Promise<AuthorMutation> {
    const author = await em.create(Author, { ...input });
    await em.persistAndFlush(author);
    return { author };
  }

  @Mutation((type) => Boolean)
  async deleteAuthor(
    @Ctx() { em }: MyContext,
    @Arg("id", (type) => ID) id: number
  ): Promise<boolean> {
    const author = await em.findOne(Author, { id });
    if (!author) {
      return false;
    }
    try {
      await em.removeAndFlush(author);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  @Mutation((type) => AuthorMutation)
  async updateAuthor(
    @Ctx() { em }: MyContext,
    @Arg("id", (type) => ID) id: number,
    @Arg("input", (type) => UpdateAuthorInput) input: UpdateAuthorInput
  ): Promise<AuthorMutation> {
    let author = await em.findOne(Author, { id });
    if (!author) {
      return { errors: [{ field: "id", error: "Author not found" }] };
    }
    author.name = input.name ?? author.name;
    author.age = input.age ?? author.age;
    await em.persistAndFlush(author);
    return { author };
  }
}
