import { Sequelize } from 'sequelize';

// Set up Sequelize connection
export const sequelize = new Sequelize('smartmenu', 'root', '', {
    host: 'localhost',
    dialect: 'mysql' // or 'postgres', 'sqlite', 'mssql' depending on your DB
});

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to SQL database');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};