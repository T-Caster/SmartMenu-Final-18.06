import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectToDatabase } from './DB/database';
import cors from 'cors';
import accountRouter from "./routes/account";
import profileRouter from "./routes/profile";
import tableRouter from "./routes/table";
import { v2 as cloudinary } from 'cloudinary';
import { socketAuthenticate } from './utils/authUtils';
import CommentModel from './DB/comment';
import { getChatComment } from './utils/commentUtils';

cloudinary.config({
  cloud_name: "dwhy4fyjf",
  api_key: "589186211885189",
  api_secret: "Ryw9dCVCrSFxkG2xOADK6OVzfKE"
});

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Update with your client's URL for production
    methods: ["GET", "POST"]
  }
});

// Use routers with specific path prefixes
app.use('/api/account', accountRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/tables', tableRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

io.use(socketAuthenticate);

io.on('connection', (socket) => {
  console.log(`Authenticated user connected: ${socket.data.user.id}`);

  socket.on('joinTable', async (tableId) => {
    socket.join(tableId);
    console.log(`User joined table: ${tableId}`);

    try {
      const comments = await CommentModel.findAll({where: { tableId: tableId }});

      // Convert comments to ChatComment format
      const chatComments = await Promise.all(comments.map(async comment => {
        return getChatComment(comment.id);
      }));
      // Emit comments to the user
      socket.emit('loadComments', chatComments.reverse());
    } catch (error) {
      console.error('Error fetching comments:', error);
      socket.emit('error', 'Error fetching comments');
    }
  });

  socket.on('sendComment', async (tableId, comment) => {
    const commentData = await CommentModel.create({body: comment.body, userId: socket.data.user.id, tableId})
    io.to(tableId).emit('receiveComment', await getChatComment(commentData.id));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Connect to database and then start the server
connectToDatabase().then(() => {
  httpServer.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});