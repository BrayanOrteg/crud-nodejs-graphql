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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const schema_1 = require("./src/graphql/schema");
const db_1 = require("./src/config/db");
const auth_1 = __importDefault(require("./src/middlewares/auth"));
const graphql_middleware_1 = require("graphql-middleware");
const permissions_1 = require("./src/graphql/permissions");
const schema_2 = require("@graphql-tools/schema");
const users_router_1 = require("./src/routes/users.router");
const comment_router_1 = require("./src/routes/comment.router");
const reaction_router_1 = require("./src/routes/reaction.router");

dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/users', users_router_1.router);
app.use('/api/comments', comment_router_1.routerComment);
app.use('/api/reactions', reaction_router_1.routerReactions);
app.use((req, res, next) => {
    if (req.path === '/graphql' && req.body.operationName === 'Login') {
        return next();
    }
    return (0, auth_1.default)(req, res, next);
});
function getContext({ req }) {
    return __awaiter(this, arguments, void 0, function* () {
        let user = { role: req.body.loggedUser, id: req.body.idUser };
        return { user };
    });
}
const schema = (0, schema_2.makeExecutableSchema)({
    typeDefs: schema_1.typeDefs,
    resolvers: schema_1.resolvers,
});
const schemaWithMiddleware = (0, graphql_middleware_1.applyMiddleware)(schema, permissions_1.permissions);
const apolloServer = new server_1.ApolloServer({
    schema: schemaWithMiddleware,
    formatError: (error) => {
        return {
            message: error.message || 'Ha ocurrido un error',
        };
    },
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield apolloServer.start();
    app.use('/graphql', (0, express4_1.expressMiddleware)(apolloServer, { context: getContext }));
    app.get('/', (req, res) => {
        res.send('La app se está ejecutando');
    });
    db_1.db.then(() => app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    }));
});
startServer();