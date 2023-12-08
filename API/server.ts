import express, { Express, Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import accountRouter from "./routes/account";
import profileRouter from "./routes/profile";
import tableRouter from "./routes/table";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Set up Sequelize connection
const sequelize = new Sequelize('smartmenu', 'root', '', {
  host: 'localhost',
  dialect: 'mysql' // or 'postgres', 'sqlite', 'mssql' depending on your DB
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQL database');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Use routers with specific path prefixes
app.use('/accounts', accountRouter);
app.use('/profiles', profileRouter);
app.use('/tables', tableRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// Connect to database and then start the server
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
});