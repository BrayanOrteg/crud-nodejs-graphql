import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userExistsError from "../exceptions/UserExistsError";
import UserModel, { UserDocument, UserInput } from "../models/user.module";
import { UserExistsError, NotAuthorizedError } from "../exceptions";


class UserService{


    // Método para crear un nuevo usuario
    public async create(userInput: UserInput): Promise<UserDocument> {

        try{

            // Verifica si el usuario ya existe por email
            const userExists = await this.findByEmail(userInput.email)

            if (userExists)
                throw new userExistsError("user already exists");

            // Hashea la contraseña antes de guardar el usuario
            userInput.password = await bcrypt.hash(userInput.password, 10)

            // Crea el nuevo usuario
            const user: UserDocument = await UserModel.create(userInput);
            return user;

        }catch(error){

            throw error;

        }
       
    }

    // Método para obtener todos los usuarios
    public async findAll(): Promise<UserDocument[] | null> { 

        try{

            // Busca y retorna todos los usuarios
            const users:  UserDocument[] | null = await UserModel.find();
            return users;

        }catch(error){
            
            throw error;

        }
       
    }

    // Método para encontrar un usuario por ID
    public async findById(id: string): Promise<UserDocument | null> { 

        try{

            // Busca y retorna el usuario con el ID dado
            const user:  UserDocument | null = await UserModel.findById(id);
            return user;

        }catch(error){
            
            throw error;

        }
       
    }

    // Método para encontrar un usuario por email
    public async findByEmail(email: string): Promise<UserDocument | null> { 

        try{

            // Busca y retorna el usuario con el email dado
            const user:  UserDocument | null = await UserModel.findOne({email});
            return user;

        }catch(error){
            
            throw error;

        }
       
    }

    // Método para autenticar al usuario e iniciar sesión
    public async login(userInput: any){

        try{

            // Verifica si el usuario existe por email
            const userExists = await this.findByEmail(userInput.email);

            if(!userExists)
                throw new NotAuthorizedError("Not authorized");

            // Compara la contraseña proporcionada con la almacenada en la base de datos
            const isMathc:boolean = await bcrypt.compare(userInput.password, userExists.password)


            if(!isMathc)
                throw new NotAuthorizedError("Not authorized");

            // Genera un token JWT para el usuario
            const token = this.generateToken(userExists);

            console.log(userExists)

            return {email: userExists.email, name: userExists.name, token};

        }catch(error){

            throw error;

        }
       
    }

    // Método para actualizar un usuario por ID
    public async update(id: string, userInput: UserInput): Promise<UserDocument | null> {

        try{

            // Busca y actualiza el usuario con el ID dado
            const user:  UserDocument | null = await UserModel.findByIdAndUpdate(id, userInput,{returnOriginal: false});
            return user;

        }catch(error){

            throw error;

        }
       
    }

    // Método para eliminar un usuario por ID
    public async delete(id: string): Promise<UserDocument | null> {

        try{

            // Busca y elimina el usuario con el ID dado
            const user:  UserDocument | null = await UserModel.findByIdAndDelete(id);
            return user;

        }catch(error){

            throw error;

        }
       
    }

    // Método privado para generar un token JWT para el usuario
    private generateToken (user:UserDocument): string {
        try {

            // Crea el token teniendo en cuenta varios parametros del usuario
            return jwt.sign({user_id: user.id, email: user.email, name: user.name, role: user.role}, process.env.JWT_SECRET || "secret", {expiresIn:"60m"});
        } catch (error) {
            throw error;
        }
    }

    

    
}

export default new UserService();