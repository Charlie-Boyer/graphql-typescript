import { MikroORM } from '@mikro-orm/core';
import { _PROD_ } from './constants';

const main = async () => {
  const orm = await MikroORM.init({
    dbName: 'newdb',
    type: 'postgresql',
    debug: !_PROD_,
  });
};

main();
console.log('hello world');
