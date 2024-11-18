import { ApolloError } from 'apollo-server-errors';
import CommentService from '../../services/comment.services';
import { CommentInput } from '../../models/comment.model';
import { ObjectId } from 'mongodb';

export const commentResolvers = {

  Query: {

    comments: async () => {
      try {
        return await CommentService.findAll();
      } catch (error) {
        throw new ApolloError('Error fetching comments', 'INTERNAL_SERVER_ERROR');
      }
    },

    comment: async (_: any, { id }: { id: string }) => {
      try {
        const comment = await CommentService.findById(id);
        if (!comment) {
          throw new ApolloError(`Comment with id ${id} not found`, 'NOT_FOUND');
        }
        return comment;
      } catch (error) {
        throw new ApolloError('Error fetching comment', 'INTERNAL_SERVER_ERROR');
      }
    },

  },

  Mutation: {

    createComment: async (_: any, { comment, parentCommentId }: { comment: string, parentCommentId?: ObjectId }, context: any) => {
      try {
        const userId = context.user.id;
        const commentInput: CommentInput = { comment, userId, parentCommentId };
        const newComment = await CommentService.create(commentInput);

        if (parentCommentId) {
          const parentComment = await CommentService.findById(parentCommentId as unknown as string);
          if (parentComment) {
            parentComment.replies = parentComment.replies || [];
            parentComment.replies.push(newComment._id as ObjectId);
            await parentComment.save();
          }
        }

        return newComment;
      } catch (error) {
        throw new ApolloError('Error creating comment', 'INTERNAL_SERVER_ERROR');
      }
    },

    updateComment: async (_: any, { id, comment, parentCommentId }: { id: string, comment: string, parentCommentId?: ObjectId }, context: any) => {
      try {
        const userId = context.user.id;
        const existingComment = await CommentService.findById(id);
        if (!existingComment) {
          throw new ApolloError('Comment not found', 'NOT_FOUND');
        }
        if (existingComment.userId.toString() !== userId.toString()) {
          throw new ApolloError('Not authorized to update this comment', 'UNAUTHORIZED');
        }

        const commentInput: CommentInput = { comment, userId, parentCommentId };
        return await CommentService.update(id, commentInput);
      } catch (error) {
        throw new ApolloError('Error updating comment', 'INTERNAL_SERVER_ERROR');
      }
    },
    
    deleteComment: async (_: any, { id }: { id: string }, context: any) => {
      try {
        const userId = context.user.id;
        const existingComment = await CommentService.findById(id);
        if (!existingComment) {
          throw new ApolloError('Comment not found', 'NOT_FOUND');
        }
        if (existingComment.userId.toString() !== userId) {
          throw new ApolloError('Not authorized to delete this comment', 'UNAUTHORIZED');
        }

        if (existingComment.parentCommentId) {
          const parentComment = await CommentService.findById(existingComment.parentCommentId.toString());
          if (parentComment) {
            parentComment.replies = (parentComment.replies || []).filter(replyId => replyId.toString() !== id);
            await parentComment.save();
          }
        }

        return await CommentService.delete(id);
      } catch (error) {
        throw new ApolloError('Error deleting comment', 'INTERNAL_SERVER_ERROR');
      }
    },
  },
};