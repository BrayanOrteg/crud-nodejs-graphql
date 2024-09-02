import {Request, Response} from "express";
import Comment, {CommentDocument, CommentInput} from "../models/comment.model";
import { UserExistsError, NotAuthorizedError } from "../exceptions";
import CommentService from "../services/comment.services";
import CommentModel from "../models/comment.model";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";
import {ReactionDocument, ReactionInput} from "../models/reaction.model";
import ReactionService from "../services/reaction.services";

class ReactionController {


    // Método para crear una nueva reacción
    public async create(req: Request, res: Response) {

        try {

            // Crea un objeto ReactionInput desde la solicitud
            const react: ReactionInput = {
                tag: req.body.tag,
                commentId: req.body.commentId,
                userId: req.body.idUser,
            }

            // Verifica si el comentario relacionado con la reacción existe
            const comment: CommentDocument | null  = await CommentService.findById(react.commentId as unknown as string);

            if (!comment) {
                res.status(404).json({error: "not found", message: `Comment with id ${react.commentId} not found`})
                return;
            }

            // Crea una nueva reacción usando el servicio de reacciones
            const reaction: ReactionDocument = await ReactionService.create(react);

            // Agrega el ID de la reacción a la lista de reacciones del comentario
            comment.reactions?.push(reaction.id)

            // Actualiza la lista de reacciones del comentario
            const commentUpdated: CommentDocument | null = await CommentService.update(comment.id,  comment);

            res.status(201).json(reaction);


        } catch (error) {
            res.status(500).json(error)
        }
    }

    // Método para obtener una reacción por su ID
    public async getReaction (req: Request, res: Response) {

        try{

            // Llama al servicio para encontrar la reacción por ID
            const reaction: ReactionDocument | null = await ReactionService.findById(req.params.id);

            if (!reaction){

                res.status(404).json({error: "not found", message: `Reaction with id ${req.params.id} not found`})
                return;
            }

            res.json(reaction);

        }catch(error){
            res.status(500).json(error)
        }

    }


    // Método para obtener todas las reacciones
    public async getAll (req: Request, res: Response) {

        try{

            // Llama al servicio para encontrar todas las reacciones
            const reactions: ReactionDocument[] | null = await ReactionService.findAll();
            if (!reactions){

                res.status(404).json({error: "not found", message: `Reactions not found`})
                return;
            }

            res.json(reactions);

        }catch(error){
            res.status(500).json(error)
        }

    }


    // Método para eliminar una reacción
    public async delete (req: Request, res: Response) {

        try{

            // Verifica si la reacción existe
            const reactionVerify : ReactionDocument | null = await ReactionService.findById( req.params.id);

            if (!reactionVerify){

                res.status(404).json({error: "not found", message: `Reaction with id ${req.params.id} not found`})
                return;
            }

            // Verifica si el usuario tiene permisos para eliminar la reacción
            if (reactionVerify.userId != req.body.idUser){

                res.status(401).json({error: "Not authorized", message: `You are not authorized to delete`})
                return;
            }

            // Verifica si el comentario relacionado con la reacción existe
            const commentParent: CommentDocument | null = await CommentService.findById(reactionVerify?.commentId as unknown as string);

            if (commentParent?.reactions) {

                // Elimina el ID de la reacción de la lista de reacciones del comentario
                commentParent.reactions = commentParent.reactions.filter(id => !id.equals(new ObjectId(reactionVerify.id)));

                // Actualiza el comentario
                const commentUpdated: CommentDocument | null = await CommentService.update(commentParent?.id,  commentParent);
            }


            // Elimina la reacción
            const react: ReactionDocument | null = await ReactionService.delete(req.params.id);


            res.json(react);

        }catch(error){
            res.status(500).json(error)
        }

    }

}


export default new  ReactionController();