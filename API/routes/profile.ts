import express, { Request, Response } from 'express';
import { createError, createServerError } from '../utils/errorUtils';

const router = express.Router();

// Endpoint to get a profile by username
router.get('/:username', async (req: Request, res: Response) => {
    try {
        // Implement logic to retrieve profile by username
        res.status(200).json({ message: 'Profile details for ' + req.params.username });
    } catch (error) {
        const serverError = createServerError(error)
        res.status(serverError.statusCode).json(serverError);
    }
});

// Endpoint for uploading a photo
router.post('/photos', async (req: Request, res: Response) => {
    try {
        // Implement photo upload logic
        // Handle multipart/form-data
        res.status(200).json({ message: 'Photo upload successful' });
    } catch (error) {
        const serverError = createServerError(error)
        res.status(serverError.statusCode).json(serverError);
    }
});

// Endpoint to set a main photo
router.post('/photos/:id/setMain', async (req: Request, res: Response) => {
    try {
        // Implement logic to set a main photo
        res.status(200).json({ message: 'Main photo set for id: ' + req.params.id });
    } catch (error) {
        const serverError = createServerError(error)
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
