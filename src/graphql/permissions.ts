import { rule, shield, and, or, not, allow } from 'graphql-shield';
import { GraphQLResolveInfo } from 'graphql';
import { Request } from 'express';

// Regla para verificar si el usuario es un administrador
const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, context, info: GraphQLResolveInfo) => {
    return context.user.role === 'SUPERADMIN';
  }
);

// Regla para verificar si el usuario es un usuario normal
const isUser = rule({ cache: 'contextual' })(
  async (parent, args, context, info: GraphQLResolveInfo) => {
    return  (context.user.role === 'USER' || context.user.role === 'SUPERADMIN');
  }
);

// Definir las reglas de permisos
export const permissions = shield({
  Query: {
    users: isUser,
    user: isUser,
    comments: isUser,
    comment: isUser,
    reactions: isUser,
    reaction: isUser,
  },
  Mutation: {
    createUser: isAdmin,
    updateUser: isAdmin,
    deleteUser: isAdmin,
    createComment: isUser,
    updateComment: isUser,
    deleteComment: isUser,
    createReaction: isUser,
    deleteReaction: isUser,
    login: allow,
  },
},
{
  fallbackError: async (thrownThing, parent, args, context, info) => {
    if (thrownThing instanceof Error) {
      return thrownThing;
    } else if (typeof thrownThing === 'string') {
      return new Error(thrownThing);
    } else {
      return new Error('Not authorized');
    }
  },
});