import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import producerRoutes from './src/routes/producerRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import fieldsRoutes from './src/routes/fieldsRoutes.js';
import observationRoutes from './src/routes/observationRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import yieldRoutes from './src/routes/yieldRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

app.use(express.json())
app.use(cookieParser())

app.use('/', authRoutes)
app.use('/', producerRoutes);
app.use('/', fieldsRoutes);
app.use('/', observationRoutes);
app.use('/', taskRoutes);
app.use('/', yieldRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});