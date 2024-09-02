import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userExistsError from "../exceptions/UserExistsError";
import UserModel, { UserDocument, UserInput } from "../models/user.module";
import { UserExistsError, NotAuthorizedError } from "../exceptions";


class UserService{

    public async create(userInput: UserInput): Promise<UserDocument> {

        try{

            const userExists = await this.findByEmail(userInput.email)

            if (userExists)
                throw new userExistsError("user already exists");
            userInput.password = await bcrypt.hash(userInput.password, 10)
            const user: UserDocument = await UserModel.create(userInput);
            return user;

        }catch(error){

            throw error;

        }
       
    }

    public async findAll(): Promise<UserDocument[] | null> { 

        try{

            const users:  UserDocument[] | null = await UserModel.find();
            return users;

        }catch(error){
            
            throw error;

        }
       
    }

    public async findById(id: string): Promise<UserDocument | null> { 

        try{

            const user:  UserDocument | null = await UserModel.findById(id);
            return user;

        }catch(error){
            
            throw error;

        }
       
    }

    public async findByEmail(email: string): Promise<UserDocument | null> { 

        try{

            const user:  UserDocument | null = await UserModel.findOne({email});
            return user;

        }catch(error){
            
            throw error;

        }
       
    }

    public async login(userInput: any){

        try{


            const userExists = await this.findByEmail(userInput.email);

            if(!userExists)
                throw new NotAuthorizedError("Not authorized");
            const isMathc:boolean = await bcrypt.compare(userInput.password, userExists.password)


            if(!isMathc)
                throw new NotAuthorizedError("Not authorized");

            const token = this.generateToken(userExists);

            console.log(userExists)

            return {email: userExists.email, name: userExists.name, token};

        }catch(error){

            throw error;

        }
       
    }

    public async update(id: string, userInput: UserInput): Promise<UserDocument | null> {

        try{

            const user:  UserDocument | null = await UserModel.findByIdAndUpdate(id, userInput,{returnOriginal: false});
            return user;

        }catch(error){

            throw error;

        }
       
    }

    public async delete(id: string, userInput: UserInput): Promise<UserDocument | null> {

        try{

            const user:  UserDocument | null = await UserModel.findByIdAndDelete(id);
            return user;

        }catch(error){

            throw error;

        }
       
    }

    private generateToken (user:UserDocument): string {
        try {
            return jwt.sign({user_id: user.id, email: user.email, name: user.name, role: user.role}, process.env.JWT_SECRET || "secret", {expiresIn:"60m"});
        } catch (error) {
            throw error;
        }
    }

    

    
}

export default new UserService();