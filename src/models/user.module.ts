import mongoose, { DateSchemaDefinition } from "mongoose";

// Define la interfaz para el input de un usuario
export interface UserInput{
 name: string;
 email: string;
 password: string;
 role: string;
}

// Define la interfaz para el documento del usuario
export interface UserDocument extends UserInput, mongoose.Document{
    createdAt: Date;
    updateAt: Date;
    deleteAt: Date;
}

// Define el esquema de Mongoose para el modelo de usuario
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, index: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: false, default: 'USER'},
}, {timestamps: true, collection:"users"})


const User = mongoose.model<UserDocument>("User", userSchema);

export default User