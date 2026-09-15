import jwt from 'jsonwebtoken';
import envConfig from '../config/env.config.js';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token
    // console.log(token)
    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, envConfig.jwt);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}