import express, { Request, Response } from 'express';
import { createError, createServerError } from '../utils/errorUtils';
import PhotoModel from '../DB/photo';
import { sequelize } from '../DB/database';
import { authenticateToken } from '../utils/authUtils';
import UserModel from '../DB/user';
import { Profile } from '../models/profile';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {},
});

const parser = multer({ storage: storage });

// Endpoint to get a profile by username
router.get('/:username', async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findOne({
            where: { username: req.params.username },
            include: [{ model: PhotoModel, as: 'photos' }] // Assuming PhotoModel is associated with UserModel
        });

        if (!user) {
            const error = createError(404, "User bit found")
            return res.status(error.statusCode).send(error)
        }

        // Find the main photo
        const mainPhoto = user.photos?.find(photo => photo.isMain);
        const profilePhotos = user.photos?.map(photo => ({
            id: photo.id.toString(),
            url: photo.url,
            isMain: photo.isMain
        })) || [];

        const profile: Profile = {
            username: user.username,
            displayName: user.displayName,
            image: mainPhoto?.url || undefined,
            bio: user.bio,
            photos: profilePhotos
        };

        res.status(200).json(profile);
    } catch (error) {
        const serverError = createServerError(error)
        res.status(serverError.statusCode).json(serverError);
    }
});

// Endpoint for uploading a photo
router.post('/photos', authenticateToken, parser.single('File'), async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user.id !== 'number') {
            const error = createError(401, 'Invalid token');
            return res.status(error.statusCode).send(error)
        }

        if (!req.file) {
            const error = createError(400, 'No file uploaded');
            return res.status(error.statusCode).send(error)
        }

        const uploadedImage = req.file.path;

        const newPhoto = await PhotoModel.create({
            url: uploadedImage,
            isMain: false,
            userId: req.user.id
        });

        res.status(200).send(newPhoto);
    } catch (error) {
        const serverError = createServerError(error);
        res.status(serverError.statusCode).json(serverError);
    }
});

// Endpoint to set a main photo
router.post('/photos/:id/setMain', authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user.id !== 'number') {
            const error = createError(401, 'Invalid token');
            return res.status(error.statusCode).send(error)
        }

        const photoId = parseInt(req.params.id);

        // Start a transaction
        await sequelize.transaction(async (transaction) => {
            // Reset isMain for all photos of the user
            await PhotoModel.update({ isMain: false }, {
                where: { userId: req.user?.id }, // Assuming req.userId is available
                transaction
            });

            // Set the specified photo as main
            const photo = await PhotoModel.findByPk(photoId, { transaction });

            if (!photo) {
                const error = createError(404, "Photo not found");
                return res.status(error.statusCode).send(error);
            }

            photo.isMain = true;
            await photo.save({ transaction });
        });

        res.status(200).json({ message: 'Main photo set', photoId });
    } catch (error) {
        const serverError = createServerError(error);
        res.status(serverError.statusCode).json(serverError);
    }
});

// Endpoint to delete a photo
router.delete('/photos/:id', async (req: Request, res: Response) => {
    try {
        // Implement delete photo logic
        res.status(200).json({ message: 'Photo deleted for id: ' + req.params.id });
    } catch (error) {
        const serverError = createServerError(error)
        res.status(serverError.statusCode).json(serverError);
    }
});

export default router;
