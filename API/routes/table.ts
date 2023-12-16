import express, { Request, Response } from 'express';
import { createError, createServerError } from '../utils/errorUtils';
import TableModel from '../DB/table';
import UserModel from '../DB/user';
import {getUserProfile} from "../utils/userUtils"
import TableAttendeeModel from '../DB/tableAttendees';
import { Table, TableFormValues } from '../models/table';
import { authenticateToken } from '../utils/authUtils';
import { Profile } from '../models/profile';
import PhotoModel from '../DB/photo';

const router = express.Router();

// Endpoint to list all tables
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user.id !== 'number') {
            const error = createError(401, 'Invalid token');
            return res.status(error.statusCode).send(error);
        }

        const tables = await TableModel.findAll();
        const tablesWithProfiles = await Promise.all(tables.map(async (table): Promise<Table> => {
            const attendeeRecords = await TableAttendeeModel.findAll({
                where: { tableId: table.id }
            });

            const attendees = await Promise.all(attendeeRecords.map(async (att) => {
                const user = await UserModel.findByPk(att.userId, {
                    include: [{ model: PhotoModel, as: "photos"}]
                });
                return user ? getUserProfile(user) : null;
            }));

            // Find the host
            const hostRecord = attendeeRecords.find(att => att.isHost);
            const hostUser = hostRecord ? await UserModel.findByPk(hostRecord.userId, {
                include: [{ model: PhotoModel, as: "photos"}]
            }) : null;
            const hostProfile = hostUser ? getUserProfile(hostUser) : undefined;

            return {
                id: table.id.toString(),
                date: table.createdAt,
                number: table.number,
                hostUsername: hostUser ? hostUser.username : undefined,
                isCancelled: table.isCancelled,
                isGoing: false, // Determine based on the current user's status
                isHost: req.user?.id === hostUser?.id,
                host: hostProfile,
                attendees: attendees.filter(att => att !== null) as Profile[]
            };
        }));

        res.status(200).json(tablesWithProfiles);
    } catch (error) {
        const serverError = createServerError(error);
        console.error(error)
        res.status(serverError.statusCode).json(serverError);
    }
});

// Endpoint to get details of a specific table
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const tableId = parseInt(req.params.id);
        const table = await TableModel.findByPk(tableId);

        if (!table) {
            const error = createError(404, 'Table not found');
            return res.status(error.statusCode).send(error)
        }

        const attendeeRecords = await TableAttendeeModel.findAll({
            where: { tableId }
        });

        const attendees = await Promise.all(attendeeRecords.map(async (att) => {
            const user = await UserModel.findByPk(att.userId, {
                include: [{ model: PhotoModel, as: "photos"}]
            });
            return user ? getUserProfile(user) : null;
        }));

        // Find the host
        const hostRecord = attendeeRecords.find(att => att.isHost);
        const hostUser = hostRecord ? await UserModel.findByPk(hostRecord.userId, {
            include: [{ model: PhotoModel, as: "photos"}]
        }) : null;
        const hostProfile = hostUser ? getUserProfile(hostUser) : undefined;

        const tableWithProfile: Table = {
            id: table.id.toString(),
            date: table.createdAt,
            number: table.number,
            hostUsername: hostUser ? hostUser.username : undefined,
            isCancelled: table.isCancelled,
            isGoing: false, // Determine based on the current user's status
            isHost:  req.user?.id === hostUser?.id,
            host: hostProfile,
            attendees: attendees.filter(att => att !== null) as Profile[]
        };

        res.status(200).json(tableWithProfile);
    } catch (error) {
        const serverError = createServerError(error);
        res.status(serverError.statusCode).json(serverError);
        console.error(error)
    }
});

// Endpoint to create a new table
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user.id !== 'number') {
            const error = createError(401, 'Invalid token');
            return res.status(error.statusCode).send(error)
        }

        // Extract table details from the request body
        const { id, number, date } = req.body as TableFormValues;

        if (!id) {
            const error = createError(400, "Table ID is required.");
            return res.status(error.statusCode).send(error)
        }

        // Check if a table with this ID already exists
        const existingTableById = await TableModel.findByPk(id);
        if (existingTableById) {
            const error = createError(400, `A table with ID ${id} already exists.`);
            return res.status(error.statusCode).send(error)
        }

        // Check if a table with the same number already exists
        const existingTableByNumber = await TableModel.findOne({ where: { number } });
        if (existingTableByNumber) {
            const error = createError(400, `A table with number ${number} already exists.`);
            return res.status(error.statusCode).send(error)
        }

        // Create a new table with the specified ID
        const newTable = await TableModel.create({ id, number, createdAt: date });

        // Join the creating user to the table as host
        await TableAttendeeModel.create({
            userId: req.user.id,
            tableId: id,  // Use the provided ID
            isHost: true
        });

        const user = await UserModel.findByPk(req.user.id, {
            include: [{ model: PhotoModel, as: "photos"}]
        });

        if (!user){
            const error = createError(401, 'User not found');
            return res.status(error.statusCode).send(error)
        }

        // Construct the Table object to return
        const hostProfile = getUserProfile(user);

        const tableWithProfile: Table = {
            id: id,  // Use the provided ID
            date: newTable.createdAt,
            number: newTable.number,
            hostUsername: req.user.username,
            isCancelled: newTable.isCancelled,
            isGoing: true,
            isHost: true,
            host: hostProfile,
            attendees: [hostProfile] // Only host in the attendees initially
        };

        res.status(201).json(tableWithProfile);
    } catch (error) {
        const serverError = createServerError(error);
        res.status(serverError.statusCode).json(serverError);
    }
});

// Endpoint to update a specific table
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user.id !== 'number') {
            const error = createError(401, 'Invalid token');
            return res.status(error.statusCode).send(error)
        }

        // Extract table id from the request parameters
        const tableId = parseInt(req.params.id);

        // Check if the current user is the host of the table
        const attendee = await TableAttendeeModel.findOne({
            where: { tableId: tableId, userId: req.user.id, isHost: true }
        });

        if (!attendee) {
            const error = createError(403, 'Not authorized to update this table');
            return res.status(error.statusCode).send(error)
        }

        // Proceed with the update
        const [updated] = await TableModel.update(req.body, {
            where: { id: tableId }
        });

        if (!updated) {
            const error = createError(404, 'Table not found');
            return res.status(error.statusCode).send(error)
        }

        res.status(200).json({ message: 'Table updated' });
    } catch (error) {
        const serverError = createServerError(error);
        res.status(serverError.statusCode).json(serverError);
    }
});



// Endpoint to delete a specific table
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user.id !== 'number') {
            const error = createError(401, 'Invalid token');
            return res.status(error.statusCode).send(error)
        }

        // Extract table id from the request parameters
        const tableId = parseInt(req.params.id);

        // Check if the current user is the host of the table
        const attendee = await TableAttendeeModel.findOne({
            where: { tableId: tableId, userId: req.user.id, isHost: true }
        });

        if (!attendee) {
            const error = createError(403, 'Not authorized to delete this table');
            return res.status(error.statusCode).send(error)
        }

        // Proceed with the deletion
        const deleted = await TableModel.destroy({
            where: { id: tableId }
        });

        if (!deleted) {
            const error = createError(404, 'Table not found');
            return res.status(error.statusCode).send(error)
        }

        res.status(200).json({ message: 'Table deleted' });
    } catch (error) {
        const serverError = createServerError(error);
        res.status(serverError.statusCode).json(serverError);
    }
});

// Endpoint to mark attendance at a specific table
router.post('/:id/attend', authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user.id !== 'number') {
            const error = createError(401, 'Invalid token');
            return res.status(error.statusCode).send(error)
        }

        const tableId = req.params.id; // Assuming tableId is a string
        const userId = req.user.id;

        // Retrieve the table to check its cancellation status
        const table = await TableModel.findByPk(tableId);
        if (!table) {
            const error = createError(404, 'Table not found');
            return res.status(error.statusCode).send(error)
        }

        // Check if the user is already attending the table
        const existingAttendance = await TableAttendeeModel.findOne({
            where: { userId: userId, tableId: tableId }
        });

        if (table.isCancelled) {
            if (existingAttendance && existingAttendance.isHost) {
                // Reopen the table if the host attends a cancelled table
                await TableModel.update({ isCancelled: false }, { where: { id: tableId } });
                res.status(200).json({ message: 'Table reopened and attendance marked' });
            } else {
                // Prevent non-hosts from attending a cancelled table
                const error = createError(400, 'Cannot attend a cancelled table');
                return res.status(error.statusCode).send(error)
            }
        } else {
            if (existingAttendance) {
                // Mark the table as cancelled if the host leaves
                if (existingAttendance.isHost) {
                    await TableModel.update({ isCancelled: true }, { where: { id: tableId } });
                } else {
                    // Remove the user from the attendees
                    await existingAttendance.destroy();
                }            
                res.status(200).json({ message: 'Attendance removed' });
            } else {
                // Add the user as an attendee
                const newAttendance = await TableAttendeeModel.create({
                    userId: userId,
                    tableId: tableId,
                    isHost: false // Assuming non-hosts use this route
                });
                res.status(201).json({ message: 'Attendance marked', attendance: newAttendance });
            }
        }
    } catch (error) {
        const serverError = createServerError(error);
        res.status(serverError.statusCode).json(serverError);
    }
});

export default router;
