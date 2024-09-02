import {NextFunction, Request, Response} from "express";

export const AdminAuth = async (req: Request, res: Response, next: NextFunction) => {

    if (req.body.loggedUser !== 'SUPERADMIN') {
        res.status(401).json({message: "Not authorized"});
    }
    next();
}

export const UserAuth = async (req: Request, res: Response, next: NextFunction) => {

    if (req.body.loggedUser !== 'SUPERADMIN' && req.body.loggedUser !== 'USER') {
        res.status(401).json({message: "Not authorized"})
    }
    next();
}