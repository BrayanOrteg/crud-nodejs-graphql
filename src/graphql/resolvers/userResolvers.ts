import { ApolloError } from 'apollo-server-errors';
import UserService from '../../services/user.services';
import { UserDocument, UserInput } from '../../models/user.module';
import { UserExistsError, NotAuthorizedError } from '../../exceptions';

export const userResolvers = {

  Query: {
    // Obtener todos los usuarios
    users: async () => {
      try {
        return await UserService.findAll();
      } catch (error) {
        // Maneja errores y lanza un error de Apollo
        throw new ApolloError('Error fetching users', 'INTERNAL_SERVER_ERROR');
      }
    },

    // Obtener un usuario por ID
    user: async (_: any, { id }: { id: string }) => {
      try {
        const user = await UserService.findById(id);
        if (!user) {
          
          throw new ApolloError(`User with id ${id} not found`, 'NOT_FOUND');
        }
        return user;
      } catch (error) {
        
        throw new ApolloError('Error fetching user', 'INTERNAL_SERVER_ERROR');
      }
    },
  },

  Mutation: {
    // Crear un nuevo usuario
    createUser: async (_: any, { name, email, password, role }: { name: string, email: string, password: string, role: string }) => {
      try {
        const userInput = { name, email, password, role };
        return await UserService.create(userInput);
      } catch (error) {
        if (error instanceof UserExistsError) {
          // Si el usuario ya existe, lanza un error de Apollo
          throw new ApolloError('User already exists', 'USER_EXISTS');
        }
        // Maneja otros errores y lanza un error de Apollo
        throw new ApolloError('Error creating user', 'INTERNAL_SERVER_ERROR');
      }
    },

    // Actualizar un usuario existente
    updateUser: async (_: any, { id, name, email, role }: { id: string, name: string, email: string, role: string }) => {
      try {
        const userInput = { name, email, role };
        const user = await UserService.update(id, userInput as UserInput);
        if (!user) {
          
          throw new ApolloError(`User with id ${id} not found`, 'NOT_FOUND');
        }
        return user;
      } catch (error) {
        
        throw new ApolloError('Error updating user', 'INTERNAL_SERVER_ERROR');
      }
    },

    // Eliminar un usuario por ID
    deleteUser: async (_: any, { id }: { id: string }) => {
      try {
        const user = await UserService.delete(id);
        if (!user) {
          
          throw new ApolloError(`User with id ${id} not found`, 'NOT_FOUND');
        }
        return user;
      } catch (error) {
        
        throw new ApolloError('Error deleting user', 'INTERNAL_SERVER_ERROR');
      }
    },

    // Inicio de sesión de usuario
    login: async (_: any, { email, password }: { email: string, password: string }) => {
      try {
        const userObj = await UserService.login({ email, password });
        return {
          token: userObj.token,
          user: userObj.name,
        };
      } catch (error) {
        if (error instanceof NotAuthorizedError) {
          // Si las credenciales son inválidas, lanza un error de Apollo
          throw new ApolloError('Invalid credentials', 'UNAUTHORIZED');
        }
        
        throw new ApolloError('Error logging in', 'INTERNAL_SERVER_ERROR');
      }
    },
  },
};