import express, {Request, Response} from "express";
import CommentController from "../controller/comment.controller";
import validateSchema from "../middlewares/validateSchema";
import auth from "../middlewares/auth";
import { UserAuth } from "../middlewares/RoleAuth";
import reactionSchema from "../schemas/reaction.schema";
import ReactionController from "../controller/reaction.controller";

// Crea un router de express para gestionar las rutas relacionadas con reacciones
export const routerReactions = express.Router();

// Ruta para crear una nueva reacción, se valida el cuerpo de la solicitud y luego se verifica la autenticación del usuario
routerReactions.post('/', validateSchema(reactionSchema),auth, UserAuth, ReactionController.create);

// Ruta para eliminar una reacción específica por ID
routerReactions.delete('/:id',auth, UserAuth, ReactionController.delete);

// Ruta para obtener todas las reacciones
routerReactions.get('/',auth, UserAuth, ReactionController.getAll);

// Ruta para obtener una reacción específica por ID
routerReactions.get('/:id',auth, UserAuth, ReactionController.getReaction);
