import mongoose from "mongoose";
import dotenv from "dotenv";

// Se cargan las variables de entorno de .env
dotenv.config();

// Define la cadena de conexión a MongoDB usando la variable de entorno MONGO_URL
const connectionString: string = process.env.MONGO_URL || "mongodb//localhost:27017/nodejs";

// Se establece la conexión a MongoDB
export const db = mongoose.connect(connectionString)
                    .then(
                        () => console.log("connected to mongoDB")
                    ).catch(
                        (err) => console.log(err)
                    )