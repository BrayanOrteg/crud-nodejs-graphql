import mongoose from 'mongoose';
import reactionsSchema from "./reaction.model";
import reactionSchema from "../schemas/reaction.schema";


// Define la interfaz para el input de un comentario
export interface CommentInput {
    comment: string;  // Texto del comentario
    replies?: mongoose.Types.ObjectId[]; // Opcional: Lista de IDs de comentarios que responden a este comentario
    parentCommentId?: mongoose.Types.ObjectId; // Opcional: ID del comentario padre (si es una respuesta)
    userId: mongoose.Types.ObjectId; // ID del usuario que hizo el comentario
    reactions?: mongoose.Types.ObjectId[]; // Opcional: Lista de IDs de reacciones asociadas al comentario
}

// Define la interfaz para el documento del comentario
export interface CommentDocument extends CommentInput, mongoose.Document {

    // Fechas auto-generadas por mongoose
    createdAt: Date;
    updatedAt: Date;
}

// Define el esquema de Mongoose para el modelo de comentario
const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true, minlength: 3 },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }],

}, { timestamps: true, collection: "comments" });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;

