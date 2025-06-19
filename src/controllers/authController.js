import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Producer from "../models/Producer.js"


const generateAccessToken = (producer) => {
    const encryptedData = { id: producer._id, email: producer.email, rol: 'admin' }
    const JWT_KEY = process.env.JWT_KEY
    const token = jwt.sign(encryptedData, JWT_KEY, { expiresIn: '1h' })
    return token
}

const generateRefreshToken = (producer) => {
    const encryptedData = { id: producer._id, email: producer.email, rol: 'admin' }
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
    const refreshToken = jwt.sign(encryptedData, JWT_REFRESH_SECRET, { expiresIn: '7d' })
    return refreshToken
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
    }
    
    try {
        const producer = await Producer.findOne({ email })
        if (!producer) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const isPasswordValid = await bcrypt.compare(password, producer.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const accessToken = generateAccessToken(producer)
        const refreshToken = generateRefreshToken(producer)

        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.json({ accessToken: accessToken })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        const newAccessToken = jwt.sign(
            { id: decoded._id, email: decoded.email, rol: 'admin' },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        )
        res.json({ accessToken: newAccessToken })

    } catch (error) {
        return res.status(403).json({ error: 'Invalid refresh token' })
    }
}