import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import path from 'path';
import { _PROD_ } from './constants';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

const main = async () => {
  //ORM
  const orm = await MikroORM.init({
    entities: [path.join(__dirname + '/entities')],
    dbName: 'newdb',
    password: 'password',
    type: 'postgresql',
    debug: !_PROD_,
  });

  //Create database
  await orm.getMigrator().up;
  const generator = orm.getSchemaGenerator();
  if (_PROD_) await generator.updateSchema();
  if (!_PROD_) {
    await generator.dropSchema();
    await generator.createSchema();
  }
  // const post = orm.em.create(Post, { title: 'my first post' });
  // await orm.em.persistAndFlush(post);

  //Express server
  const app = express();
  app.listen(3000, () => {
    console.log('server started on port 3000');
  });

  console.log(__dirname + '/resolvers/**/*.{ts,js}');
  //Apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });
  apolloServer.applyMiddleware({ app });
};

main();
