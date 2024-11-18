import { userResolvers } from './resolvers/userResolvers';
import { commentResolvers } from './resolvers/commentResolvers';
import { reactionResolvers } from './resolvers/reactionResolvers';

import { gql } from 'apollo-server-express';




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
    replies: [Comment]
    reactions: [Reaction]
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
    createComment(comment: String!, userId: ID!, parentCommentId: ID): Comment
    updateComment(id: ID!, comment: String!, userId: ID!, parentCommentId: ID): Comment
    deleteComment(id: ID!, userId: ID!): Comment
    createReaction(tag: String!, commentId: ID!, userId: ID!): Reaction
    deleteReaction(id: ID!, userId: ID!): Reaction
    login(email: String!, password: String!): AuthPayload
  }

  fragment UserInfo on User {
    id
    name
    email
    role
  }
`;

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