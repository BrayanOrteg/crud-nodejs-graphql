import {NextFunction, Request, Response} from "express";

export const AdminAuth = async (req: Request, res: Response, next: NextFunction) => {

    // Verifica si el rol del usuario es 'SUPERADMIN'
    if (req.body.loggedUser !== 'SUPERADMIN') {

        // Si el usuario no es SUPERADMIN, responde con un error 401
        res.status(401).json({message: "Not authorized"});
    }
    next();
}

export const UserAuth = async (req: Request, res: Response, next: NextFunction) => {

    // Verifica si el rol del usuario es 'SUPERADMIN' o 'USER'
    if (req.body.loggedUser !== 'SUPERADMIN' && req.body.loggedUser !== 'USER') {

        // Si el usuario no tiene uno de los roles permitidos, responde con un error 401
        res.status(401).json({message: "Not authorized"})
    }
    next();
}