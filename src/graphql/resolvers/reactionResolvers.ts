import { ApolloError } from 'apollo-server-errors';
import ReactionService from '../../services/reaction.services';
import CommentService from '../../services/comment.services';
import { ReactionInput } from '../../models/reaction.model';
import { CommentDocument } from '../../models/comment.model';
import { ObjectId } from 'mongodb';

export const reactionResolvers = {

  Query: {

    reactions: async () => {
      try {
        return await ReactionService.findAll();
      } catch (error) {
        throw new ApolloError('Error fetching reactions', 'INTERNAL_SERVER_ERROR');
      }
    },

    reaction: async (_: any, { id }: { id: string }) => {
      try {
        const reaction = await ReactionService.findById(id);
        if (!reaction) {
          throw new ApolloError(`Reaction with id ${id} not found`, 'NOT_FOUND');
        }
        return reaction;
      } catch (error) {
        throw new ApolloError('Error fetching reaction', 'INTERNAL_SERVER_ERROR');
      }
    },

  },


  Mutation: {

    createReaction: async (_: any, { tag, commentId }: { tag: string, commentId: ObjectId }, context: any) => {
      try {
        const userId = context.user.id;
        const reactionInput: ReactionInput = { tag, commentId, userId };

        const comment: CommentDocument | null = await CommentService.findById(commentId as unknown as string);
        if (!comment) {
          throw new ApolloError(`Comment with id ${commentId} not found`, 'NOT_FOUND');
        }

        const reaction = await ReactionService.create(reactionInput);
        comment.reactions?.push(reaction.id);
        await CommentService.update(comment.id, comment);

        return reaction;
      } catch (error) {
        throw new ApolloError('Error creating reaction', 'INTERNAL_SERVER_ERROR');
      }
    },

    deleteReaction: async (_: any, { id }: { id: string }, context: any) => {
      try {
        const userId = context.user.id;
        const reactionVerify = await ReactionService.findById(id);
        if (!reactionVerify) {
          throw new ApolloError(`Reaction with id ${id} not found`, 'NOT_FOUND');
        }

        if (reactionVerify.userId.toString() !== userId) {
          throw new ApolloError('Not authorized to delete this reaction', 'UNAUTHORIZED');
        }

        if (!reactionVerify.commentId) {
          throw new ApolloError('Comment ID is undefined', 'BAD_REQUEST');
        }

        const commentParent = await CommentService.findById(reactionVerify.commentId.toString());
        if (commentParent?.reactions) {
          commentParent.reactions = commentParent.reactions.filter(reactionId => !reactionId.equals(new ObjectId(reactionVerify.id)));
          await CommentService.update(commentParent.id, commentParent);
        }

        return await ReactionService.delete(id);
      } catch (error) {
        throw new ApolloError('Error deleting reaction', 'INTERNAL_SERVER_ERROR');
      }
    },

    
  },
};