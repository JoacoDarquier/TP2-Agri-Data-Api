import Producer from "../models/Producer.js";
import bcrypt from "bcryptjs";
//import supabase from "../config/supabase";


export const createProducer = async (req, res) => {

    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
        return res.status(400).json({error: "All fields are required"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const producer = {
        name,
        email,
        phone,
        password: hashedPassword,
    };

    try {
        const newProducer = await Producer.create(producer);
        res.status(201).json(newProducer);
    } catch (error) {
        res.status(500).json({error: "Error creating producer"});
    }
};



export const getProducers = async (req, res) => {
    try {
        const producers = await Producer.find();
        res.json(producers);
    } catch (error) {
        res.status(500).json({error: "Error fetching producers"});
    }
};


export const getProducerById = async (req, res) => {
    try {
        const producer = await Producer.findById(req.params.id);
        if (producer) {
            res.json(producer);
        } else {
            res.status(404).json({error: "Producer not found"});
        }
    } catch (error) {
        res.status(500).json({error: "Invalid ID"});
    }
};
