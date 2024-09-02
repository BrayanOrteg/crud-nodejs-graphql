import mongoose from 'mongoose';
import reactionsSchema from "./reaction.model";
import reactionSchema from "../schemas/reaction.schema";

export interface CommentInput {
    comment: string;
    replies?: mongoose.Types.ObjectId[];
    parentCommentId?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    reactions?: mongoose.Types.ObjectId[];
}

export interface CommentDocument extends CommentInput, mongoose.Document {
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true, minlength: 3 },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }],

}, { timestamps: true, collection: "comments" });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;





