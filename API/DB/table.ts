import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../DB/database';

class TableModel extends Model {
    public id!: number;
    public createdAt!: Date;
    public number!: number;
    public isCancelled!: boolean;
}

TableModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
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
