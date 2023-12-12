import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../DB/database';

class RequestModel extends Model {
    public id!: number;
    public body!: string;
    public userId!: number;
    public tableId!: number;
    public createdAt!: Date;
}

RequestModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    body: {
        type: new DataTypes.TEXT,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    tableId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'tables',
            key: 'id',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'requests',
    sequelize,
});

export default RequestModel;
