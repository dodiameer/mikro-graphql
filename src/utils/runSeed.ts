import { Author } from "../entities/Author";
import { Book } from "../entities/Book";
import { MyContext } from "../types";
import faker from "faker";

const runSeed = async (em: MyContext["em"]) => {
  const books = await em.find(Book, {});
  if (books.length !== 0) {
    return;
  }
  const fakePeople = [];

  /* Fake authors */
  for (let i = 0; i < 10; i++) {
    const author: Author = await em.create(Author, {
      name: faker.name.findName(),
      age: faker.random.number(85),
    });

    await em.persistAndFlush(author);
    fakePeople.push(author);
  }

  fakePeople.forEach(async (author) => {
    for (let i = 0; i < 10; i++) {
      const book = await em.create(Book, {
        title: faker.random.words(faker.random.number(12)),
        author: author,
      });
      await em.persistAndFlush(book);
    }
  });
};

export default runSeed;
