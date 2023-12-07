import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import accountRouter from "./routes/account";
import profileRouter from "./routes/profile";
import tableRouter from "./routes/table";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Use routers with specific path prefixes
app.use('/accounts', accountRouter);
app.use('/profiles', profileRouter);
app.use('/tables', tableRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
