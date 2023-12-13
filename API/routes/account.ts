import express, { Request, Response } from 'express';
import { createError, createServerError } from '../utils/errorUtils';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User, UserFormValues} from "../models/user"
import {PhotoModel, UserModel} from "../DB/associations"
import { authenticateToken } from '../utils/authUtils';

const router = express.Router();

const JWT_SECRET = "averysecurejwtsecret"

// Utility function to generate JWT token
function generateToken(user: UserModel) {
    return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
}

// Utility function to hash password
async function hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Utility function to compare password
async function comparePassword(inputPassword: string, hashedPassword :string) {
    return await bcrypt.compare(inputPassword, hashedPassword);
}

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user.id !== 'number') {
            const error = createError(401, 'Invalid token')
            return res.status(error.statusCode).send(error)
        }

        const user = await UserModel.findByPk(req.user.id, {
            include: [{ model: PhotoModel, as: 'photos' }]
        });
        
        if (user) {
            const userPhotos = user?.photos || [];
            const mainPhoto = userPhotos.find(photo => photo.isMain);
            const userResponse: User = {
                username: user.username,
                displayName: user.displayName,
                token: '', // Typically not returned in a GET request
                image: mainPhoto?.url
            };

            res.status(200).json(userResponse);
        } else {
            const error = createError(404, 'User not found');
            return res.status(error.statusCode).send(error)
        }
    } catch (error) {
        console.error(error);
        const serverError = createServerError(error);
        res.status(serverError.statusCode).json(serverError);
    }
});

// Endpoint for user login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as UserFormValues;
        const user = await UserModel.findOne({ where: { email } });

        if (user && await comparePassword(password, user.passwordHash)) {
            const token = generateToken(user);
            const userPhotos = user?.photos || [];
            const mainPhoto = userPhotos.find(photo => photo.isMain) || { url: 'default-photo-url.jpg' };
            const userResponse: User = {
                username: user.username,
                displayName: user.displayName,
                token,
                image: mainPhoto.url
            };
            res.status(200).json(userResponse);
        } else {
            const error = createError(401, 'Invalid credentials');
            return res.status(error.statusCode).send(error)
        }
    } catch (error) {
        const serverError = createServerError(error)
        res.status(serverError.statusCode).json(serverError);
    }
});

// Endpoint for user registration
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password, displayName, username } = req.body as UserFormValues;
        const hashedPassword = await hashPassword(password);

        const newUser = await UserModel.create({
            displayName,
            username,
            email,
            passwordHash: hashedPassword,
            role: 'user'
        });

        const token = generateToken(newUser);
        const userResponse: User = {
            username: newUser.username,
            displayName: newUser.displayName,
            token,
            // image: newUser.image // Uncomment if your user model has an image field
        };
        res.status(200).json(userResponse);
    } catch (error) {
        console.error(error);
        const serverError = createServerError(error)
        res.status(serverError.statusCode).json(serverError);
    }
});

export default router;
