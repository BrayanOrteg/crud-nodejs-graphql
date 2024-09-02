import express, {Request, Response} from "express";
import userController from "../controller/user.controller";
import validateSchema from "../middlewares/validateSchema";
import userSchema from "../schemas/user.schema";
import auth from "../middlewares/auth";
import { UserAuth, AdminAuth } from "../middlewares/RoleAuth";

// Crea un router de express para gestionar las rutas relacionadas con usuarios
export const router = express.Router();

// Ruta para crear un nuevo usuario, se valida el cuerpo de la solicitud y luego se verifica la autenticación del usuario y su rol de admin
router.post('/', validateSchema(userSchema),auth, AdminAuth, userController.create);

// Ruta para iniciar sesión
router.post("/login", userController.login)

// Ruta para obtener todos los usuarios
router.get('/',auth, UserAuth, userController.getAll);

// Ruta para obtener un usuario específico por ID
router.get('/:id', auth, UserAuth, userController.getUser);

// Ruta para actualizar un usuario específico por ID
router.put('/:id',auth, AdminAuth, userController.update);

// Ruta para eliminar un usuario específico por ID
router.delete('/:id',auth, AdminAuth, userController.delete);

