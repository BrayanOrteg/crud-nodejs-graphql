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


    public async create(req: Request, res: Response) {

        try {

            const react: ReactionInput = {
                tag: req.body.tag,
                commentId: req.body.commentId,
                userId: req.body.idUser,
            }

            const comment: CommentDocument | null  = await CommentService.findById(react.commentId as unknown as string);

            if (!comment) {
                res.status(404).json({error: "not found", message: `Comment with id ${react.commentId} not found`})
                return;
            }

            const reaction: ReactionDocument = await ReactionService.create(react);

            comment.reactions?.push(reaction.id)
            const commentUpdated: CommentDocument | null = await CommentService.update(comment.id,  comment);

            res.status(201).json(reaction);


        } catch (error) {
            res.status(500).json(error)
        }
    }

    public async getReaction (req: Request, res: Response) {

        try{

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


    public async getAll (req: Request, res: Response) {

        try{

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


    public async delete (req: Request, res: Response) {

        try{


            const reactionVerify : ReactionDocument | null = await ReactionService.findById( req.params.id);

            if (!reactionVerify){

                res.status(404).json({error: "not found", message: `Reaction with id ${req.params.id} not found`})
                return;
            }

            if (reactionVerify.userId != req.body.idUser){

                res.status(401).json({error: "Not authorized", message: `You are not authorized to delete`})
                return;
            }


            const commentParent: CommentDocument | null = await CommentService.findById(reactionVerify?.commentId as unknown as string);

            if (commentParent?.reactions) {

                commentParent.reactions = commentParent.reactions.filter(id => !id.equals(new ObjectId(reactionVerify.id)));

                const commentUpdated: CommentDocument | null = await CommentService.update(commentParent?.id,  commentParent);
            }


            const react: ReactionDocument | null = await ReactionService.delete(req.params.id);


            res.json(react);

        }catch(error){
            res.status(500).json(error)
        }

    }

}


export default new  ReactionController();