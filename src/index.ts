import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { typeDefs, resolvers } from './graphql/schema';
import { db } from './config/db';
import userServices from './services/user.services';
import auth from "./middlewares/auth";
import userController from "./controller/user.controller";
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from './graphql/permissions';
import { makeExecutableSchema } from '@graphql-tools/schema';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/graphql' && req.body.operationName === 'Login') {
    return next();
  }
  return auth(req, res, next);
});

async function getContext({ req }: { req: Request }) {

  let user = { role: req.body.loggedUser, id: req.body.idUser };
  return { user };
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Aplica las middleware de permisos al esquema
const schemaWithMiddleware = applyMiddleware(schema, permissions);

// Configura Apollo Server con el esquema modificado
const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware, 
  formatError: (error) => {

    return {
      message: error.message || 'Ha ocurrido un error',
    };
  },
});

const startServer = async () => {
  await apolloServer.start();
  app.use('/graphql', apolloMiddleware(apolloServer, { context: getContext }));

  app.get('/', (req: Request, res: Response) => {
    res.send('La app se está ejecutando');
  });

  db.then(() =>
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    })
  );
};

startServer();