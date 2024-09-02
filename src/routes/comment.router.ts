import express, {Request, Response} from "express";
import CommentController from "../controller/comment.controller";
import validateSchema from "../middlewares/validateSchema";
import commentSchema from "../schemas/comment.schema";
import auth from "../middlewares/auth";
import { UserAuth, AdminAuth } from "../middlewares/RoleAuth";

// Crea un router de express para gestionar las rutas relacionadas con comentarios
export const routerComment = express.Router();


// Ruta para crear un nuevo comentario, se valida el cuerpo de la solicitud y luego se verifica la autenticación del usuario
routerComment.post('/', validateSchema(commentSchema),auth, UserAuth, CommentController.create);

// Ruta para obtener todos los comentarios
routerComment.get('/', auth, UserAuth, CommentController.getAll);

// Ruta para obtener un comentario específico por ID
routerComment.get('/:id', auth, UserAuth, CommentController.getComment);

// Ruta para actualizar un comentario específico por ID
routerComment.put('/:id',auth, UserAuth, CommentController.update);

// Ruta para eliminar un comentario específico por ID
routerComment.delete('/:id',auth, UserAuth, CommentController.delete);

