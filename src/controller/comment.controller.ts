import {Request, Response} from "express";
import Comment, {CommentDocument, CommentInput} from "../models/comment.model";
import { UserExistsError, NotAuthorizedError } from "../exceptions";
import CommentService from "../services/comment.services";
import CommentModel from "../models/comment.model";
import mongoose from "mongoose";
import {ObjectId} from "mongodb";


class CommentController {


    public async create(req: Request, res: Response) {

        try {

            const commentInput: CommentInput = {
                comment: req.body.comment,
                replies: req.body.replies,
                parentCommentId: req.body.parentCommentId,
                userId: req.body.idUser,
            }

            const comment: CommentDocument = await CommentService.create(commentInput);

            if (commentInput.parentCommentId != null){

                const commentVerify : CommentDocument | null = await CommentService.findById(req.body.parentCommentId);

                if (!commentVerify){
                    res.status(404).json({error: "not found", message: `Comment with id ${commentInput.parentCommentId} not found`})
                    return;
                }


                if (commentVerify.replies) {
                    commentVerify.replies.push(comment._id as mongoose.Types.ObjectId);
                }

                const commentUpdated: CommentDocument | null = await CommentService.update(commentVerify.id,  commentVerify);
            }


            res.status(201).json(comment);

        } catch (error) {
            res.status(500).json(error)
        }
    }


    public async update (req: Request, res: Response) {

        try{

            const commentInput: CommentInput = {
                comment: req.body.comment,
                replies: req.body.replies,
                parentCommentId: req.body.parentCommentId,
                userId: req.body.idUser,
            }

            const commentVerify : CommentDocument | null = await CommentService.findById( req.params.id);

            if (!commentVerify){

                res.status(404).json({error: "not found", message: `Comment with id ${req.params.id} not found`})
                return;
            }

            if (commentVerify.userId != req.body.idUser){

                res.status(401).json({error: "Not authorized", message: `You are not authorized`})
                return;
            }

            const comment: CommentDocument | null = await CommentService.update(req.params.id,  commentInput);

            res.json(comment);

        }catch(error){
            res.status(500).json(error)
        }
    }


    public async delete (req: Request, res: Response) {

        try{


            const commentVerify : CommentDocument | null = await CommentService.findById( req.params.id);

            if (!commentVerify){

                res.status(404).json({error: "not found", message: `Comment with id ${req.params.id} not found`})
                return;
            }

            if (commentVerify.userId != req.body.idUser){

                res.status(401).json({error: "Not authorized", message: `You are not authorized to delete`})
                return;
            }


            if (commentVerify.parentCommentId != null){
                const commentParent: CommentDocument | null = await CommentService.findById(commentVerify.parentCommentId as unknown as string);

                if (commentParent?.replies) {

                    commentParent.replies = commentParent.replies.filter(id => !id.equals(new ObjectId(commentVerify.id)));

                    const commentUpdated: CommentDocument | null = await CommentService.update(commentParent?.id,  commentParent);
                }
            }

            const comment: CommentDocument | null = await CommentService.delete(req.params.id, req.body as CommentInput);


            res.json(comment);

        }catch(error){
            res.status(500).json(error)
        }

    }


    public async getComment (req: Request, res: Response) {

        try{

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


    public async getAll (req: Request, res: Response) {

        try{

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
