import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../DB/database';

class TableAttendeeModel extends Model {
    public userId!: number;
    public tableId!: number;
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
        type: DataTypes.INTEGER,
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
    // Note: No primary key is defined as per your requirements
});

export default TableAttendeeModel;
