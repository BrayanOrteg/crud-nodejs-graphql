import {Request, Response} from "express";
import { UserDocument, UserInput } from "../models/user.module";
import userServices from "../services/user.services";

import { UserExistsError, NotAuthorizedError } from "../exceptions";

class UserController{

    // Método para crear un nuevo usuario
    public async create (req: Request, res: Response) {

        try{

            // const userExists = await userServices.findByEmail(req.body.email)
            // if (!userExists)

            // Crea un nuevo usuario usando el servicio de usuarios
            const user: UserDocument = await userServices.create(req.body as UserInput);
            res.status(201).json(user);    

        }catch(error){

            // Maneja el error si el usuario ya existe
            if (error instanceof UserExistsError)
                res.status(404).json({ message: "user already exists"})
            res.status(500).json(error)
        }

        //res.status(201).send('Create user with email: ' + req.body.email);
    }


    // Método para actualizar un usuario existente
    public async update (req: Request, res: Response) {
        
        try{

            // Actualiza un usuario usando el servicio de usuarios
            const user: UserDocument | null = await userServices.update(req.params.id, req.body as UserInput);


            if (!user){
                // Maneja el error si el usuario no existe
                res.status(404).json({error: "not found", message: `User with id ${req.params.id} not found`})
                return;
            }

            res.json(user); 

        }catch(error){
            res.status(500).json(error)
        }

        //res.send('Update user');
    }

    // Método para obtener un usuario por su ID
    public async getUser (req: Request, res: Response) {

        try{

            // Busca un usuario por ID usando el servicio de usuarios
            const user: UserDocument | null = await userServices.findById(req.params.id);

            if (!user){

                res.status(404).json({error: "not found", message: `User with id ${req.params.id} not found`})
                return;
            }
            
            res.json(user); 

        }catch(error){
            res.status(500).json(error)
        }


        //res.send(`Get user with id: ${req.params.id}`);
    }


    // Método para obtener todos los usuarios
    public async getAll (req: Request, res: Response) {
        
        try{

            // Busca todos los usuarios usando el servicio de usuarios
            const users: UserDocument[] | null = await userServices.findAll();
            if (!users){
                
                res.status(404).json({error: "not found", message: `Users not found`})
                return;
            }
            
            res.json(users); 

        }catch(error){
            res.status(500).json(error)
        }


    }

    // Método para eliminar un usuario por su ID
    public async delete (req: Request, res: Response) {

        try{

            // Elimina un usuario usando el servicio de usuarios
            const user: UserDocument | null = await userServices.delete(req.params.id);

            if (!user){
                res.status(404).json({error: "not found", message: `User with id ${req.params.id} not found`})
                return;
            }
            
            res.json(user); 

        }catch(error){
            res.status(500).json(error)
        }


    }

    // Método para iniciar sesión de un usuario
    public async login (req: Request, res: Response) {

        try{

            // Intenta iniciar sesión usando el servicio de usuarios
            const userObj = await userServices.login(req.body);
            res.status(201).json(userObj);

        }catch(error){

            // Maneja el error si las credenciales son inválidas
            if (error instanceof NotAuthorizedError)
                res.status(404).json({ message: "Invalid credentials"})
            res.status(500).json(error)
        }
    }
}

export default new  UserController();

