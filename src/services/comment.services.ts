import userExistsError from "../exceptions/UserExistsError";
import UserModel, { UserDocument, UserInput } from "../models/user.module";
import {  NotAuthorizedError } from "../exceptions";
import CommentModel, {CommentDocument, CommentInput} from "../models/comment.model";
import commentModel from "../models/comment.model";


class CommentService{


    // Método para crear un nuevo comentario recive un objeto de tipo CommentInput
    public async create (commentInput: CommentInput): Promise<CommentDocument>{
        try {

            // Crea un nuevo comentario en la base de datos
            const comment: CommentDocument = await CommentModel.create(commentInput);
            return comment;
        } catch (error) {

            throw error;
        }
    }

    // Método para obtener todos los comentarios
    public async findAll(): Promise<CommentDocument[]|null> {

        try{

            // Busca y retorna todos los comentarios en la base de datos
            const comments:  CommentDocument[] | null = await CommentModel.find();
            return comments;

        }catch(error){
            throw error;
        }
    }

    // Método para encontrar un comentario por ID
    public async findById(id: string): Promise<CommentDocument|null> {

        try{

            // Busca y retorna el comentario con el ID dado
            const comment:  CommentDocument | null = await CommentModel.findById(id);
            return comment;

        }catch(error){
            throw error;
        }
    }

    // Método para actualizar un comentario por ID, recibe el id del commentario y el objeto CommentInput
    public async update(id: string, commentInput: CommentInput): Promise<CommentDocument | null> {

        try{

            // Actualiza el comentario con el ID dado y retorna el comentario actualizado
            const comment:  CommentDocument | null = await CommentModel.findByIdAndUpdate(id, commentInput,{returnOriginal: false});
            return comment;

        }catch(error){
            throw error;
        }
    }

    // Método para eliminar un comentario por ID
    public async delete(id: string, commentInput: CommentInput): Promise<CommentDocument | null> {

        try{

            // Elimina el comentario con el ID dado y retorna el comentario eliminado
            const comment:  CommentDocument | null = await CommentModel.findByIdAndDelete(id);
            return comment;

        }catch(error){

            throw error;
        }
    }

}

export default new CommentService();