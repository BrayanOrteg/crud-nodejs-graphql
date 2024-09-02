import { Request, Response, NextFunction } from "express";
import jwt, {TokenExpiredError} from "jsonwebtoken";


/**
 * Middleware para autenticar solicitudes usando JWT
 * @param req - El objeto de solicitud
 * @param res - El objeto de respuesta
 * @param next - La función para pasar al siguiente middleware
 */
const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Obtiene el token de los encabezados de autorización
        let token = req.headers.authorization;

        if(!token) {

            // Si no se proporciona el token, responde con error 401 (No autorizado)
            res.status(401).json({message: "Not authorized"})
        }else{
            // Elimina el prefijo "Bearer " del token
            token = token.replace("Bearer ", "")

            // Verifica el token usando el secreto JWT
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

            // Añade el rol del usuario y el ID del usuario al cuerpo de la solicitud
            req.body.loggedUser = decoded.role;
            req.body.idUser = decoded.user_id;

            // Llama a la siguiente función
            next();
        }

    } catch (error) {
        if(error instanceof TokenExpiredError)
            res.status(401).json({message:"Token Expired", error})
        else
            res.status(401).json({message:"Token Invalid", error})
    }
}

export default auth;


