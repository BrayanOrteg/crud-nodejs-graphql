import { object, string, array, optional, TypeOf } from 'zod';
import {enum as zEnum} from "zod/lib/types";
import reactionSchema from "./reaction.schema";



const commentSchema = object({

    comment: string({ required_error: "Comment is required" })
        .min(3, "Comment must be at least 3 characters long"),
    replies: optional(array(object({}).nonstrict())),
    parentCommentId: optional(string()),
    reactions: optional(array(
        object({}).refine((data) => reactionSchema.safeParse(data).success, {
            message: "Invalid comment structure",
        })))
});


// Exportar el esquema completo
export default commentSchema;

// Exportar el tipo del esquema
export type CommentInput = TypeOf<typeof commentSchema>;




