"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const hello_1 = require("./resolvers/hello");
const post_1 = require("./resolvers/post");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const orm = yield core_1.MikroORM.init({
        entities: [path_1.default.join(__dirname + '/entities')],
        dbName: 'newdb',
        password: 'password',
        type: 'postgresql',
        debug: !constants_1._PROD_,
    });
    yield orm.getMigrator().up;
    const generator = orm.getSchemaGenerator();
    if (constants_1._PROD_)
        yield generator.updateSchema();
    if (!constants_1._PROD_) {
        yield generator.dropSchema();
        yield generator.createSchema();
    }
    const post = orm.em.create(Post_1.Post, { title: 'my first post' });
    yield orm.em.persistAndFlush(post);
    const app = express_1.default();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [hello_1.HelloResolver, post_1.PostResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em }),
    });
    apolloServer.applyMiddleware({ app });
    app.listen(3000, () => {
        console.log('server started on port 3000');
    });
});
main();
//# sourceMappingURL=index.js.map