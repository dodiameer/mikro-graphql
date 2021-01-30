import { Book } from "../entities/Book";
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
import { MaxLength } from "class-validator";
import { Author } from "../entities/Author";

@InputType()
class CreateBookInput {
  @Field()
  @MaxLength(100, { message: "Title must be 100 characters or less" })
  title!: string;

  @Field((type) => ID)
  authorId!: number;
}

@ObjectType()
class BookMutation {
  @Field((type) => [MutationError], { nullable: true })
  errors?: MutationError[];

  @Field((type) => Book, { nullable: true })
  book?: Book;
}

@Resolver()
export class BookResolver {
  @Query((type) => [Book])
  async books(
    @Ctx() { em }: MyContext,
    @Arg("limit", (type) => Int, { nullable: true }) limit: number = 10,
    @Arg("offset", (type) => Int, { nullable: true }) offset: number = 0,
    @Info() info: GraphQLResolveInfo
  ): Promise<Book[]> {
    const books = await em.find(
      Book,
      {},
      { limit, offset, populate: loadRelations(info) }
    );
    return books;
  }

  @Query((type) => Int)
  async countBooks(@Ctx() { em }: MyContext): Promise<number> {
    const count = await em.count(Book);
    return count;
  }

  @Query((type) => Book, { nullable: true })
  async book(
    @Ctx() { em }: MyContext,
    @Arg("id", (type) => ID) id: number,
    @Info() info: GraphQLResolveInfo
  ): Promise<Book | null> {
    const book = await em.findOne(
      Book,
      { id },
      { populate: loadRelations(info) }
    );
    return book;
  }

  @Mutation((type) => BookMutation)
  async createBook(
    @Ctx() { em }: MyContext,
    @Arg("input", (type) => CreateBookInput) input: CreateBookInput
  ): Promise<BookMutation> {
    const author = await em.findOne(Author, { id: input.authorId });

    if (!author) {
      return {
        errors: [
          {
            field: "authorId",
            error: "Author not found",
          },
        ],
      };
    }

    const book = await em.create(Book, { title: input.title, author: author });
    await em.persistAndFlush(book);
    return { book };
  }

  @Mutation((type) => Boolean)
  async deleteBook(
    @Ctx() { em }: MyContext,
    @Arg("id", (type) => ID) id: number
  ): Promise<boolean> {
    const book = await em.findOne(Book, { id });
    if (!book) {
      return false;
    }
    try {
      await em.removeAndFlush(book);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
