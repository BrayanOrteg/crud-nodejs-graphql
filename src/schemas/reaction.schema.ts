import { object, string, enum as zEnum } from 'zod';

const reactionSchema = object({

    tag:  zEnum(['LIKE', 'LOVE', 'DISLIKE', 'HATE']).default('LIKE'),
    commentId:  string({ required_error: "Comment id is required" })
});


// Exportar el esquema completo
export default reactionSchema;
