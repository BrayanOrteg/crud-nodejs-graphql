import userExistsError from "../exceptions/UserExistsError";
import UserModel, { UserDocument, UserInput } from "../models/user.module";
import {  NotAuthorizedError } from "../exceptions";
import CommentModel, {CommentDocument, CommentInput} from "../models/comment.model";
import commentModel from "../models/comment.model";
import ReactionModel, {ReactionDocument, ReactionInput} from "../models/reaction.model";


class ReactionService{


    // Método para crear una nueva reacción recibe un objeto tipo reactionInput
    public async create (reactionInput: ReactionInput): Promise<ReactionDocument>{
        try {

            // Crea una nueva reacción en la base de datos
            const reaction: ReactionDocument = await ReactionModel.create(reactionInput);
            return reaction;
        } catch (error) {

            throw error;
        }
    }

    // Método para obtener todas las reacciones
    public async findAll(): Promise<ReactionDocument[]|null> {

        try{

            // Busca y retorna todas las reacciones en la base de datos
            const reactions:  ReactionDocument[] | null = await ReactionModel.find();
            return reactions;

        }catch(error){
            throw error;
        }
    }

    // Método para encontrar una reacción por ID
    public async findById(id: string): Promise<ReactionDocument|null> {

        try{

            // Busca y retorna la reacción con el ID dado
            const reaction:  ReactionDocument | null = await ReactionModel.findById(id);
            return reaction;

        }catch(error){
            throw error;
        }
    }

    // Método para eliminar una reacción por ID
    public async delete(id: string): Promise<ReactionDocument | null> {

        try{

            // Elimina la reacción con el ID dado y retorna la reacción eliminada
            const reaction:  ReactionDocument | null = await ReactionModel.findByIdAndDelete(id);
            return reaction;
        }catch(error){

            throw error;
        }
    }

}

export default new ReactionService();