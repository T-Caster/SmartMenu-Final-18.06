// authUtils.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import UserModel from '../DB/user';
import PhotoModel from '../DB/photo';

const JWT_SECRET = "averysecurejwtsecret";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const socketAuthenticate = async (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: No token provided'));
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
       
        socket.data.user = await UserModel.findByPk(decoded.id, {
            include: [{ model: PhotoModel, as: "photos"}]
        });
        console.log(socket);
        next();
    } catch (err) {
        console.error(err)
        return next(new Error('Authentication error'));
    }
};
