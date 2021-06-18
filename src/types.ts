import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';

export type EmContextType = {
  em: EntityManager<IDatabaseDriver<Connection>>;
};
