import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conectarDB = async ()=> {

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB Conectado correctamente");
        
    } catch (error) {
        console.error("Error al conectar con MongoDB: ", error.message)
    }
}

export default conectarDB