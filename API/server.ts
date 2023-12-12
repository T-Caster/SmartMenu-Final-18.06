import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './DB/database';
import cors from 'cors';
import accountRouter from "./routes/account";
import profileRouter from "./routes/profile";
import tableRouter from "./routes/table";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "dwhy4fyjf",
  api_key: "589186211885189",
  api_secret: "Ryw9dCVCrSFxkG2xOADK6OVzfKE"
});

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Use routers with specific path prefixes
app.use('/api/account', accountRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/tables', tableRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// Connect to database and then start the server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});