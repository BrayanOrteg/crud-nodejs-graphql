import {Request, Response} from "express";
import Comment, {CommentDocument, CommentInput} from "../models/comment.model";
import { UserExistsError, NotAuthorizedError } from "../exceptions";
import CommentService from "../services/comment.services";
import CommentModel from "../models/comment.model";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";


class CommentController {

    // Método para crear un nuevo comentario
    public async create(req: Request, res: Response) {

        try {
            // Crea un objeto CommentInput desde la solicitud
            const commentInput: CommentInput = {
                comment: req.body.comment,
                replies: req.body.replies,
                parentCommentId: req.body.parentCommentId,
                userId: req.body.idUser,
            }

            // Llama al servicio para crear el comentario y espera la respuesta
            const comment: CommentDocument = await CommentService.create(commentInput);

            // Si el comentario tiene un comentario padre, actualiza la lista de respuestas del padre
            if (commentInput.parentCommentId != null){

                const commentVerify : CommentDocument | null = await CommentService.findById(req.body.parentCommentId);

                if (!commentVerify){
                    res.status(404).json({error: "not found", message: `Comment with id ${commentInput.parentCommentId} not found`})
                    return;
                }


                if (commentVerify.replies) {
                    commentVerify.replies.push(comment._id as mongoose.Types.ObjectId);
                }

                // Actualiza el comentario padre con la nueva lista de respuestas
                const commentUpdated: CommentDocument | null = await CommentService.update(commentVerify.id,  commentVerify);
            }


            res.status(201).json(comment);

        } catch (error) {
            res.status(500).json(error)
        }
    }


    // Método para actualizar un comentario existente
    public async update (req: Request, res: Response) {

        try{

            // Crea un objeto CommentInput desde la solicitud
            const commentInput: CommentInput = {
                comment: req.body.comment,
                replies: req.body.replies,
                parentCommentId: req.body.parentCommentId,
                userId: req.body.idUser,
            }

            // Verifica si el comentario existe
            const commentVerify : CommentDocument | null = await CommentService.findById( req.params.id);

            if (!commentVerify){

                res.status(404).json({error: "not found", message: `Comment with id ${req.params.id} not found`})
                return;
            }

            // Verifica si el usuario tiene permisos para actualizar el comentario
            if (commentVerify.userId != req.body.idUser){

                res.status(401).json({error: "Not authorized", message: `You are not authorized`})
                return;
            }

            // Llama al servicio para actualizar el comentario
            const comment: CommentDocument | null = await CommentService.update(req.params.id,  commentInput);

            res.json(comment);

        }catch(error){
            res.status(500).json(error)
        }
    }


    // Método para eliminar un comentario
    public async delete (req: Request, res: Response) {

        try{


            // Verifica si el comentario existe
            const commentVerify : CommentDocument | null = await CommentService.findById( req.params.id);

            if (!commentVerify){

                res.status(404).json({error: "not found", message: `Comment with id ${req.params.id} not found`})
                return;
            }

            // Verifica si el usuario tiene permisos para eliminar el comentario
            if (commentVerify.userId != req.body.idUser){

                res.status(401).json({error: "Not authorized", message: `You are not authorized to delete`})
                return;
            }


            // Si el comentario tiene un comentario padre, actualiza la lista de respuestas del padre
            if (commentVerify.parentCommentId != null){
                const commentParent: CommentDocument | null = await CommentService.findById(commentVerify.parentCommentId as unknown as string);

                if (commentParent?.replies) {

                    commentParent.replies = commentParent.replies.filter(id => !id.equals(new ObjectId(commentVerify.id)));

                    // Actualiza el comentario padre con la lista de respuestas sin el comentario eliminado
                    const commentUpdated: CommentDocument | null = await CommentService.update(commentParent?.id,  commentParent);
                }
            }

            // Llama al servicio para eliminar el comentario
            const comment: CommentDocument | null = await CommentService.delete(req.params.id, req.body as CommentInput);


            res.json(comment);

        }catch(error){
            res.status(500).json(error)
        }

    }


    // Método para obtener un comentario por su ID
    public async getComment (req: Request, res: Response) {

        try{

            // Llama al servicio para encontrar el comentario por ID
            const comment: CommentDocument | null = await CommentService.findById(req.params.id);

            if (!comment){

                res.status(404).json({error: "not found", message: `Comment with id ${req.params.id} not found`})
                return;
            }

            res.json(comment);

        }catch(error){
            res.status(500).json(error)
        }

    }


    // Método para obtener todos los comentarios
    public async getAll (req: Request, res: Response) {

        try{

            // Llama al servicio para encontrar todos los comentarios
            const comments: CommentDocument[] | null = await CommentService.findAll();
            if (!comments){

                res.status(404).json({error: "not found", message: `Comments not found`})
                return;
            }

            res.json(comments);

        }catch(error){
            res.status(500).json(error)
        }

    }






}


export default new  CommentController();
