import { Migration } from '@mikro-orm/migrations';

export class Migration20210131122321 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "author" drop constraint if exists "author_age_check";');
    this.addSql('alter table "author" alter column "age" type int4 using ("age"::int4);');
    this.addSql('alter table "author" alter column "age" drop not null;');
  }

}
