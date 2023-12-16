import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import { sequelize } from './database';
import UserModel from './user';
import TableModel from './table';

class CommentModel extends Model {
    public id!: number;
    public body!: string;
    public userId!: number;
    public tableId!: string;
    public createdAt!: Date;

    // Declare a function to get associated user
    public getUser!: BelongsToGetAssociationMixin<UserModel>;

    // Optional: Declare the user property for TypeScript
    public user!: UserModel;
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

CommentModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'
});

CommentModel.belongsTo(TableModel, {
    foreignKey: 'tableId',
    as: 'table'
});

export default CommentModel;
