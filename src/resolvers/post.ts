import { Post } from '../entities/Post';
import { EmContextType } from 'src/types';
import { Ctx, Query, Resolver } from 'type-graphql';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Ctx()
    { em }: EmContextType
  ) {
    return em.find(Post, {});
  }
}
