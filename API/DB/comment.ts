import { Model, DataTypes } from 'sequelize';
import { sequelize } from './database';

class CommentModel extends Model {
    public id!: number;
    public body!: string;
    public userId!: number;
    public tableId!: string;
    public createdAt!: Date;
}

CommentModel.init({
    id: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.STRING(255),
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
    tableName: 'comments',
    sequelize,
});

export default CommentModel;
