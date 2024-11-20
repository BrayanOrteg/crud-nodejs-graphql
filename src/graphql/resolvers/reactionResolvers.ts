import { ApolloError } from 'apollo-server-errors';
import ReactionService from '../../services/reaction.services';
import CommentService from '../../services/comment.services';
import { ReactionInput } from '../../models/reaction.model';
import { CommentDocument } from '../../models/comment.model';
import { ObjectId } from 'mongodb';

export const reactionResolvers = {

  Query: {
    // Obtener todas las reacciones
    reactions: async () => {
      try {
        // Llama al servicio para obtener todas las reacciones
        return await ReactionService.findAll();
      } catch (error) {
        // Maneja errores y lanza un error de Apollo
        throw new ApolloError('Error fetching reactions', 'INTERNAL_SERVER_ERROR');
      }
    },

    // Obtener una reacción por ID
    reaction: async (_: any, { id }: { id: string }) => {
      try {
        // Llama al servicio para obtener una reacción por ID
        const reaction = await ReactionService.findById(id);
        if (!reaction) {
          // Si la reacción no se encuentra, lanza un error de Apollo
          throw new ApolloError(`Reaction with id ${id} not found`, 'NOT_FOUND');
        }
        return reaction;
      } catch (error) {
        
        throw new ApolloError('Error fetching reaction', 'INTERNAL_SERVER_ERROR');
      }
    },
  },

  Mutation: {
    // Crear una nueva reacción
    createReaction: async (_: any, { tag, commentId }: { tag: string, commentId: ObjectId }, context: any) => {
      try {
        const userId = context.user.id;
        const reactionInput: ReactionInput = { tag, commentId, userId };

        // Verifica si el comentario existe
        const comment: CommentDocument | null = await CommentService.findById(commentId as unknown as string);
        if (!comment) {
          // Si el comentario no se encuentra, lanza un error de Apollo
          throw new ApolloError(`Comment with id ${commentId} not found`, 'NOT_FOUND');
        }

        // Crea la reacción y la asocia al comentario
        const reaction = await ReactionService.create(reactionInput);
        comment.reactions?.push(reaction.id);
        await CommentService.update(comment.id, comment);

        return reaction;
      } catch (error) {
        
        throw new ApolloError('Error creating reaction', 'INTERNAL_SERVER_ERROR');
      }
    },

    // Eliminar una reacci��n por ID
    deleteReaction: async (_: any, { id }: { id: string }, context: any) => {
      try {
        const userId = context.user.id;
        const reactionVerify = await ReactionService.findById(id);
        if (!reactionVerify) {
          // Si la reacción no se encuentra, lanza un error de Apollo
          throw new ApolloError(`Reaction with id ${id} not found`, 'NOT_FOUND');
        }

        // Verifica si el usuario está autorizado para eliminar la reacción
        if (reactionVerify.userId.toString() !== userId) {
          throw new ApolloError('Not authorized to delete this reaction', 'UNAUTHORIZED');
        }

        if (!reactionVerify.commentId) {
          throw new ApolloError('Comment ID is undefined', 'BAD_REQUEST');
        }

        // Elimina la reacción del comentario asociado
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