import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import producerRoutes from './src/routes/producerRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

app.use(express.json())

app.use('/', producerRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});