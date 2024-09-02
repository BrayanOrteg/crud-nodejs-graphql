import express, {Request, Response} from "express";
import CommentController from "../controller/comment.controller";
import validateSchema from "../middlewares/validateSchema";
import auth from "../middlewares/auth";
import { UserAuth } from "../middlewares/RoleAuth";
import reactionSchema from "../schemas/reaction.schema";
import ReactionController from "../controller/reaction.controller";


export const routerReactions = express.Router();

routerReactions.post('/', validateSchema(reactionSchema),auth, UserAuth, ReactionController.create);
routerReactions.delete('/:id',auth, UserAuth, ReactionController.delete);
routerReactions.get('/',auth, UserAuth, ReactionController.getAll);
routerReactions.get('/:id',auth, UserAuth, ReactionController.getReaction);
