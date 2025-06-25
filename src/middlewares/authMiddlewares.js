import jwt from 'jsonwebtoken';


export const authenticate = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if ( !authHeader?.startsWith('Bearer ') ) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token or expired' });
    }
};

