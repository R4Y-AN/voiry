import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import User from '../models/user.model.js';
export const verifyToken = (req, res, next) => {
    const token = req.body.access_token;


    if (!token) return next(errorHandler(401, 'You are not authenticated!'));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Token is not valid!'));
        req.user = user;
        next();
    });


}

export async function verifyUserCredentials(userId, passChangedTime) {
    const validUser = await User.findById(userId);
    if (!validUser || passChangedTime !== validUser.passwordChangedTime) {
        throw errorHandler(401, 'Invalid credentials or password changed. Please sign in again.');
    }
}