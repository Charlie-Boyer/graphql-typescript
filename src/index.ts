import { MikroORM } from '@mikro-orm/core';
import path from 'path';
import { _PROD_ } from './constants';
import { Post } from './entities/Post';

const main = async () => {
  const orm = await MikroORM.init({
    entities: [path.join(__dirname + '/entities')],
    dbName: 'newdb',
    password: 'password',
    type: 'postgresql',
    debug: !_PROD_,
  });

  await orm.getMigrator().up;

  const generator = orm.getSchemaGenerator();
  
  if (_PROD_) await generator.updateSchema();

  if (!_PROD_) {
    await generator.dropSchema();
    await generator.createSchema();
  }

  const post = orm.em.create(Post, { title: 'my first post' });
  await orm.em.persistAndFlush(post);
};

main();
