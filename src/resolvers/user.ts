import { User } from '../entities/User';
import { EmContextType } from 'src/types';
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import argon2 from 'argon2';

//add errors to response
@ObjectType()
class UserResponse {
  @Field(() => String, { nullable: true })
  errors?: string;
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { em }: EmContextType
  ) {
    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, {
      username,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() { em }: EmContextType
  ) {
    const user = await em.findOne(User, { username });
    if (!user) return { errors: "pas d'utilisateur" };
    if (await argon2.verify(user.password, password)) return { user };
    else return { errors: 'mauvais mot de passe' };
  }
}
