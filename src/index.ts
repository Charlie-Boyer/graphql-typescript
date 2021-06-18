import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import path from 'path';
import { _PROD_ } from './constants';
import { Post } from './entities/Post';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';

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

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(3000, () => {
    console.log('server started on port 3000');
  });
};

main();
