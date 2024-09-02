import mongoose from 'mongoose';


export interface ReactionInput {
    tag: string;
    commentId?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
}

export interface ReactionDocument extends ReactionInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

const reactionSchema = new mongoose.Schema({
    tag: {type: String, required: true, default: 'LIKE'},
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null, required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, collection: "reactions" });

const Reaction = mongoose.model('Reaction', reactionSchema);

export default Reaction;

