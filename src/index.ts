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

dotenv.config(); // Carga las variables de entorno

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Configuración de middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de autenticación para todas las rutas excepto login
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/graphql' && req.body.operationName === 'Login') {
    return next();
  }
  return auth(req, res, next);
});

// Función de contexto para proporcionar información del usuario a los resolvers
async function getContext({ req }: { req: Request }) {
  let user = { role: req.body.loggedUser, id: req.body.idUser };
  return { user };
}

// Crear esquema ejecutable con definiciones de tipos y resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Aplicar middleware de permisos al esquema
const schemaWithMiddleware = applyMiddleware(schema, permissions);

// Configurar Apollo Server 
const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware, 
  formatError: (error) => {
    return {
      message: error.message || 'Ha ocurrido un error',
    };
  },
});

// Iniciar el servidor de Apollo
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