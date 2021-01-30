import { Migration } from '@mikro-orm/migrations';

export class Migration20210130095808 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "author" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "age" int4 not null);');

    this.addSql('create table "book" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" varchar(255) not null, "author_id" int4 not null);');

    this.addSql('alter table "book" add constraint "book_author_id_foreign" foreign key ("author_id") references "author" ("id") on update cascade;');
  }

}
