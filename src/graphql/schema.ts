import { userResolvers } from './resolvers/userResolvers';
import { commentResolvers } from './resolvers/commentResolvers';
import { reactionResolvers } from './resolvers/reactionResolvers';
import { gql } from 'apollo-server-express';

// Define las definiciones de tipos de GraphQL
export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Comment {
    id: ID!
    comment: String!
    userId: ID!
    parentCommentId: ID
    replies: [ID]
    reactions: [ID]
  }

  type Reaction {
    id: ID!
    tag: String!
    commentId: ID!
    userId: ID!
  }

  type AuthPayload {
    token: String!
    user: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    comments: [Comment]
    comment(id: ID!): Comment
    reactions: [Reaction]
    reaction(id: ID!): Reaction
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!, role: String!): User
    updateUser(id: ID!, name: String, email: String, role: String): User
    deleteUser(id: ID!): User
    createComment(comment: String!, parentCommentId: ID): Comment
    updateComment(id: ID!, comment: String!, parentCommentId: ID): Comment
    deleteComment(id: ID!): Comment
    createReaction(tag: String!, commentId: ID!): Reaction
    deleteReaction(id: ID!): Reaction
    login(email: String!, password: String!): AuthPayload
  }

  fragment UserInfo on User {
    id
    name
    email
    role
  }
`;

// Combina los resolvers para diferentes tipos
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...commentResolvers.Query,
    ...reactionResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...reactionResolvers.Mutation,
  },
};