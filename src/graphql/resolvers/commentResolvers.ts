import CommentService from '../../services/comment.services';
import { CommentInput } from '../../models/comment.model';
import { ObjectId } from 'mongodb';

export const commentResolvers = {
  Query: {
    comments: async () => await CommentService.findAll(),
    comment: async (_: any, { id }: { id: string }) => await CommentService.findById(id),
  },
  Mutation: {
    createComment: async (_: any, { comment, userId, parentCommentId }: { comment: string, userId: ObjectId, parentCommentId?: ObjectId }) => {
      const commentInput: CommentInput = { comment, userId, parentCommentId };
      const newComment = await CommentService.create(commentInput);

      // Si el comentario tiene un comentario padre, actualiza la lista de respuestas del padre
      if (parentCommentId) {
        const parentComment = await CommentService.findById(parentCommentId as unknown as string);
        if (parentComment) {
          parentComment.replies = parentComment.replies || [];
          parentComment.replies.push(newComment._id as ObjectId);
          await parentComment.save();
        }
      }

      return newComment;
    },
    updateComment: async (_: any, { id, comment, userId, parentCommentId }: { id: string, comment: string, userId: ObjectId, parentCommentId?: ObjectId }) => {
      const existingComment = await CommentService.findById(id);
      if (!existingComment) throw new Error('Comment not found');
      if (existingComment.userId.toString() !== userId.toString()) throw new Error('Not authorized to update this comment');

      const commentInput: CommentInput = { comment, userId, parentCommentId };
      return await CommentService.update(id, commentInput);
    },
    deleteComment: async (_: any, { id, userId }: { id: string, userId: string }) => {
      const existingComment = await CommentService.findById(id);
      if (!existingComment) throw new Error('Comment not found');
      if (existingComment.userId.toString() !== userId) throw new Error('Not authorized to delete this comment');

      // Si el comentario tiene un comentario padre, actualiza la lista de respuestas del padre
      if (existingComment.parentCommentId) {
        const parentComment = await CommentService.findById(existingComment.parentCommentId.toString());
        if (parentComment) {
          parentComment.replies = (parentComment.replies || []).filter(replyId => replyId.toString() !== id);
          await parentComment.save();
        }
      }

      return await CommentService.delete(id);
    },
  },
};