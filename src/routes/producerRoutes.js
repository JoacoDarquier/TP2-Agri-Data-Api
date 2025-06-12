import express from "express";
import { createProducer, getProducers, getProducerById } from "../controllers/producerController.js";


const router = express.Router();

router.get('/api/producers', getProducers);
router.get('/api/producers/:id', getProducerById);
router.post('/api/producers', createProducer);


export default router;