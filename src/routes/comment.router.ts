import express, {Request, Response} from "express";
import CommentController from "../controller/comment.controller";
import validateSchema from "../middlewares/validateSchema";
import commentSchema from "../schemas/comment.schema";
import auth from "../middlewares/auth";
import { UserAuth, AdminAuth } from "../middlewares/RoleAuth";


export const routerComment = express.Router();

routerComment.post('/', validateSchema(commentSchema),auth, UserAuth, CommentController.create);


routerComment.get('/', auth, UserAuth, CommentController.getAll);

routerComment.get('/:id', auth, UserAuth, CommentController.getComment);


routerComment.put('/:id',auth, UserAuth, CommentController.update);

routerComment.delete('/:id',auth, UserAuth, CommentController.delete);

