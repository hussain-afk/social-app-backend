import jwt from 'jsonwebtoken';
import envConfig from '../config/env.config.js';

const generateToken = async (user) => {
    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
    }, envConfig.jwt, { expiresIn: '1h' });

    return token;
};

export default generateToken;
