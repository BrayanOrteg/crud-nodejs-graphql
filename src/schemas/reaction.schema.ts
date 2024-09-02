import { object, string, enum as zEnum } from 'zod';

// Define el esquema para la validación de reacciones
const reactionSchema = object({

    tag:  zEnum(['LIKE', 'LOVE', 'DISLIKE', 'HATE']).default('LIKE'),
    commentId:  string({ required_error: "Comment id is required" })
});


// Exportar el esquema completo
export default reactionSchema;
