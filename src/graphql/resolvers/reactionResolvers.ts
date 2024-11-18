import ReactionService from '../../services/reaction.services';
import CommentService from '../../services/comment.services';
import { ReactionInput } from '../../models/reaction.model';
import { CommentDocument } from '../../models/comment.model';
import { ObjectId } from 'mongodb';

export const reactionResolvers = {
  Query: {
    reactions: async () => await ReactionService.findAll(),
    reaction: async (_: any, { id }: { id: string }) => await ReactionService.findById(id),
  },
  Mutation: {
    createReaction: async (_: any, { tag, commentId, userId }: { tag: string, commentId: ObjectId, userId: ObjectId }) => {
      const reactionInput: ReactionInput = { tag, commentId, userId };

      // Verifica si el comentario relacionado con la reacción existe
      const comment: CommentDocument | null = await CommentService.findById(commentId as unknown as string);
      if (!comment) {
        throw new Error(`Comment with id ${commentId} not found`);
      }

      // Crea una nueva reacción usando el servicio de reacciones
      const reaction = await ReactionService.create(reactionInput);

      // Agrega el ID de la reacción a la lista de reacciones del comentario
      comment.reactions?.push(reaction.id);

      // Actualiza la lista de reacciones del comentario
      await CommentService.update(comment.id, comment);

      return reaction;
    },
    deleteReaction: async (_: any, { id, userId }: { id: string, userId: string }) => {
      // Verifica si la reacción existe
      const reactionVerify = await ReactionService.findById(id);
      if (!reactionVerify) {
        throw new Error(`Reaction with id ${id} not found`);
      }

      // Verifica si el usuario tiene permisos para eliminar la reacción
      if (reactionVerify.userId.toString() !== userId) {
        throw new Error('Not authorized to delete this reaction');
      }

      // Verifica si el comentario relacionado con la reacción existe
      if (!reactionVerify.commentId) {
        throw new Error('Comment ID is undefined');
      }
      const commentParent = await CommentService.findById(reactionVerify.commentId.toString());
      if (commentParent?.reactions) {
        // Elimina el ID de la reacción de la lista de reacciones del comentario
        commentParent.reactions = commentParent.reactions.filter(reactionId => !reactionId.equals(new ObjectId(reactionVerify.id)));

        // Actualiza el comentario
        await CommentService.update(commentParent.id, commentParent);
      }

      // Elimina la reacción
      return await ReactionService.delete(id);
    },
  },
};