import userExistsError from "../exceptions/UserExistsError";
import UserModel, { UserDocument, UserInput } from "../models/user.module";
import {  NotAuthorizedError } from "../exceptions";
import CommentModel, {CommentDocument, CommentInput} from "../models/comment.model";
import commentModel from "../models/comment.model";
import ReactionModel, {ReactionDocument, ReactionInput} from "../models/reaction.model";


class ReactionService{


    public async create (reactionInput: ReactionInput): Promise<ReactionDocument>{
        try {
            const reaction: ReactionDocument = await ReactionModel.create(reactionInput);
            return reaction;
        } catch (error) {

            throw error;
        }
    }


    public async findAll(): Promise<ReactionDocument[]|null> {

        try{
            const reactions:  ReactionDocument[] | null = await ReactionModel.find();
            return reactions;

        }catch(error){
            throw error;
        }
    }

    public async findById(id: string): Promise<ReactionDocument|null> {

        try{
            const reaction:  ReactionDocument | null = await ReactionModel.findById(id);
            return reaction;

        }catch(error){
            throw error;
        }
    }

    public async delete(id: string): Promise<ReactionDocument | null> {

        try{
            const reaction:  ReactionDocument | null = await ReactionModel.findByIdAndDelete(id);
            return reaction;
        }catch(error){

            throw error;
        }
    }

}

export default new ReactionService();