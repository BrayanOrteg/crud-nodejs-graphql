import {Request, Response, NextFunction} from "express";
import { AnyZodObject, Schema } from "zod";

/**
 * Middleware para validar el esquema de la solicitud usando Zod
 * @param schema - El esquema para validar el cuerpo de la solicitud
 */
const validateSchema = (schema: AnyZodObject) => {
    return async (req:Request, res: Response, next: NextFunction) => {
        try{

            // Intenta validar el cuerpo de la solicitud contra el esquema Zod
            await schema.parseAsync(req.body);
            next();
        }catch(error){
            res.status(400).json(error);
        }
    }
}

export default validateSchema;