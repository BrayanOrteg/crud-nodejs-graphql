import UserService from '../../services/user.services';
import { UserDocument, UserInput } from '../../models/user.module';

export const userResolvers = {
  Query: {
    users: async () => await UserService.findAll(),
    user: async (_: any, { id }: { id: string }) => await UserService.findById(id),
  },
  Mutation: {
    createUser: async (_: any, { name, email, password, role }: { name: string, email: string, password: string, role: string }) => {
      const userInput = { name, email, password, role };
      return await UserService.create(userInput);
    },
    updateUser: async (_: any, { id, name, email, role }: { id: string, name: string, email: string, role: string }) => {
      const userInput = { name, email, role };
      return await UserService.update(id, userInput as UserInput);
    },
    deleteUser: async (_: any, { id }: { id: string }) => await UserService.delete(id),

    login: async (_: any, { email, password }: { email: string, password: string }) => {
        const userObj = await UserService.login({ email, password });
        return {
          token: userObj.token,
          user: userObj.name,
        };
      },
  },
};