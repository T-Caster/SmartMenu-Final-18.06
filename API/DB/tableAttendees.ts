import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../DB/database';
import UserModel from './user';
import TableModel from './table';

class TableAttendeeModel extends Model {
    public userId!: number;
    public tableId!: string;
    public isHost!: boolean;
}

TableAttendeeModel.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        }
    },
    tableId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: 'tables',
            key: 'id',
        }
    },
    isHost: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
}, {
    tableName: 'table_attendees',
    sequelize,
});

// Set up associations
UserModel.belongsToMany(TableModel, {
    through: TableAttendeeModel,
    foreignKey: 'userId',
    otherKey: 'tableId'
});

TableModel.belongsToMany(UserModel, {
    through: TableAttendeeModel,
    foreignKey: 'tableId',
    otherKey: 'userId'
});

export default TableAttendeeModel;

