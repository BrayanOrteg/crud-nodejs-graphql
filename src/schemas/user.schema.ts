import { object, string, enum as zEnum } from 'zod';

// Define el esquema para la validación de usuarios
const userSchema = object({
    name: string({required_error: "Name is required"}),
    email: string({required_error: "Email is required"})
        .email("Not valid email address"),
    password: string({required_error: "Passwors is required"})
        .min(8, "Password must be atleast 8 characters long"),
    role: zEnum(['USER', 'SUPERADMIN']).default('USER'),
})

// Exportar el schema completo
export default userSchema;
   
