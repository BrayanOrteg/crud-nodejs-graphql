import userExistsError from "../exceptions/UserExistsError";
import UserModel, { UserDocument, UserInput } from "../models/user.module";
import {  NotAuthorizedError } from "../exceptions";
import CommentModel, {CommentDocument, CommentInput} from "../models/comment.model";
import commentModel from "../models/comment.model";


class CommentService{


    public async create (commentInput: CommentInput): Promise<CommentDocument>{
        try {
            const comment: CommentDocument = await CommentModel.create(commentInput);
            return comment;
        } catch (error) {

            throw error;
        }
    }


    public async findAll(): Promise<CommentDocument[]|null> {

        try{
            const comments:  CommentDocument[] | null = await CommentModel.find();
            return comments;

        }catch(error){
            throw error;
        }
    }

    public async findById(id: string): Promise<CommentDocument|null> {

        try{
            const comment:  CommentDocument | null = await CommentModel.findById(id);
            return comment;

        }catch(error){
            throw error;
        }
    }

    public async update(id: string, commentInput: CommentInput): Promise<CommentDocument | null> {

        try{
            const comment:  CommentDocument | null = await CommentModel.findByIdAndUpdate(id, commentInput,{returnOriginal: false});
            return comment;

        }catch(error){
            throw error;
        }
    }

    public async delete(id: string, commentInput: CommentInput): Promise<CommentDocument | null> {

        try{
            const comment:  CommentDocument | null = await CommentModel.findByIdAndDelete(id);
            return comment;

        }catch(error){

            throw error;
        }
    }

}

export default new CommentService();