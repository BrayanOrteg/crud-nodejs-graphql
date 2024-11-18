import { ApolloError } from 'apollo-server-errors';
import UserService from '../../services/user.services';
import { UserDocument, UserInput } from '../../models/user.module';
import { UserExistsError, NotAuthorizedError } from '../../exceptions';

export const userResolvers = {
  Query: {
    users: async () => {
      try {
        return await UserService.findAll();
      } catch (error) {
        throw new Error('Error fetching users');
      }
    },
    user: async (_: any, { id }: { id: string }) => {
      try {
        const user = await UserService.findById(id);
        if (!user) {
          throw new Error(`User with id ${id} not found`);
        }
        return user;
      } catch (error) {
        throw new Error('Error fetching user');
      }
    },
  },
  Mutation: {
    createUser: async (_: any, { name, email, password, role }: { name: string, email: string, password: string, role: string }) => {
      try {
        const userInput = { name, email, password, role };
        return await UserService.create(userInput);
      } catch (error) {
        if (error instanceof UserExistsError) {
          throw new Error('User already exists');
        }
        throw new Error('Error creating user');
      }
    },
    updateUser: async (_: any, { id, name, email, role }: { id: string, name: string, email: string, role: string }) => {
      try {
        const userInput = { name, email, role };
        const user = await UserService.update(id, userInput as UserInput);
        if (!user) {
          throw new Error(`User with id ${id} not found`);
        }
        return user;
      } catch (error) {
        throw new Error('Error updating user');
      }
    },

    deleteUser: async (_: any, { id }: { id: string }) => {
      try {
        const user = await UserService.delete(id);
        if (!user) {
          throw new Error(`User with id ${id} not found`);
        }
        return user;
      } catch (error) {
        throw new Error('Error deleting user');
      }
    },

    login: async (_: any, { email, password }: { email: string, password: string }) => {
      try {
        const userObj = await UserService.login({ email, password });
        return {
          token: userObj.token,
          user: userObj.name,
        };
      } catch (error) {
        if (error instanceof NotAuthorizedError) {
          throw new ApolloError('Invalid credentials');
        }
        throw new ApolloError('Error logging in', 'INTERNAL_SERVER_ERROR');
      }
    },
  },
};