import {Request, Response} from "express";
import { UserDocument, UserInput } from "../models/user.module";
import userServices from "../services/user.services";

import { UserExistsError, NotAuthorizedError } from "../exceptions";

class UserController{
    
    public async create (req: Request, res: Response) {

        try{

            // const userExists = await userServices.findByEmail(req.body.email)
            // if (!userExists)
                
            const user: UserDocument = await userServices.create(req.body as UserInput);
            res.status(201).json(user);    

        }catch(error){
            if (error instanceof UserExistsError)
                res.status(404).json({ message: "user already exists"})
            res.status(500).json(error)
        }

        //res.status(201).send('Create user with email: ' + req.body.email);
    }

    public async update (req: Request, res: Response) {
        
        try{

            const user: UserDocument | null = await userServices.update(req.params.id, req.body as UserInput);


            if (!user){
                
                res.status(404).json({error: "not found", message: `User with id ${req.params.id} not found`})
                return;
            }

            res.json(user); 

        }catch(error){
            res.status(500).json(error)
        }

        //res.send('Update user');
    }

    public async getUser (req: Request, res: Response) {

        try{

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


    public async getAll (req: Request, res: Response) {
        
        try{

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

    public async delete (req: Request, res: Response) {

        try{

            const user: UserDocument | null = await userServices.delete(req.params.id, req.body as UserInput);

            if (!user){
                res.status(404).json({error: "not found", message: `User with id ${req.params.id} not found`})
                return;
            }
            
            res.json(user); 

        }catch(error){
            res.status(500).json(error)
        }


    }

    public async login (req: Request, res: Response) {

        try{
                
            const userObj = await userServices.login(req.body);
            res.status(201).json(userObj);

        }catch(error){
            if (error instanceof NotAuthorizedError)
                res.status(404).json({ message: "Invalid credentials"})
            res.status(500).json(error)
        }
    }
}

export default new  UserController();

