import mongoose from 'mongoose';

// Define la interfaz para el input de una reacción
export interface ReactionInput {
    tag: string; // Tipo de reacción (por ejemplo hasta el momento son, 'LIKE', 'DISLIKE', 'LOVE','HATE')
    commentId?: mongoose.Types.ObjectId; // ID del comentario al que se aplica la reacción
    userId: mongoose.Types.ObjectId; // ID del usuario que hizo la reacción
}

// Define la interfaz para el documento de la reacción
export interface ReactionDocument extends ReactionInput, mongoose.Document {

    // Fechas auto-generadas por mongoose
    createdAt: Date;
    updatedAt: Date;
}

// Define el esquema de Mongoose para el modelo de reacción
const reactionSchema = new mongoose.Schema({
    tag: {type: String, required: true, default: 'LIKE'},
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null, required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, collection: "reactions" });

const Reaction = mongoose.model('Reaction', reactionSchema);

export default Reaction;

