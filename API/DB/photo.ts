import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../DB/database';

class PhotoModel extends Model {
    public id!: number;
    public url!: string;
    public isMain!: boolean;
    public userId!: number;
}

PhotoModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    url: {
        type: new DataTypes.TEXT,
        allowNull: true,
    },
    isMain: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        }
    }
}, {
    tableName: 'photos',
    sequelize,
});

export default PhotoModel;
