import { Post } from '../entities/Post';
import { EmContextType } from 'src/types';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

@Resolver()
export class PostResolver {
  //findall
  @Query(() => [Post])
  posts(@Ctx() { em }: EmContextType) {
    return em.find(Post, {});
  }

  //find post(id, ctx)
  @Query(() => Post, { nullable: true })
  post(
    @Arg('id') id: number,
    @Ctx()
    { em }: EmContextType
  ) {
    return em.findOne(Post, { id });
  }

  //create
  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx()
    { em }: EmContextType
  ) {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  //update
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id') id: number,
    @Arg('title') title: string,
    @Ctx()
    { em }: EmContextType
  ) {
    try {
      const post = await em.findOneOrFail(Post, { id });
      post.title = title;
      await em.persistAndFlush(post);
      return post;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //delete
  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: number,
    @Ctx()
    { em }: EmContextType
  ) {
    return await em.nativeDelete(Post, { id });
  }
}
