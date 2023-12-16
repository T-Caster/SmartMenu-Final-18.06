import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../DB/database';
import CommentModel from './comment';

class TableModel extends Model {
    public id!: string;
    public createdAt!: Date;
    public number!: number;
    public isCancelled!: boolean;
}

TableModel.init({
    id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
    },
    isCancelled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
}, {
    tableName: 'tables',
    sequelize,
});

export default TableModel;
