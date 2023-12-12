import { Model, DataTypes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, Optional } from 'sequelize';
import { sequelize } from '../DB/database';
import PhotoModel from './photo';

// User attributes in the database
interface UserAttributes {
    id: number;
    displayName: string;
    username: string;
    email: string;
    passwordHash: string;
    role: string;
    bio?: string;
}

// Some attributes are optional in 'User.build' and 'User.create' methods
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class UserModel extends Model<UserAttributes, UserCreationAttributes> {
    public id!: number;
    public displayName!: string;
    public username!: string;
    public email!: string;
    public passwordHash!: string;
    public role!: string;
    public bio?: string;

    // Associations
    public getPhotos!: HasManyGetAssociationsMixin<PhotoModel>;
    public addPhoto!: HasManyAddAssociationMixin<PhotoModel, number>;
    public hasPhoto!: HasManyHasAssociationMixin<PhotoModel, number>;
    public photos?: PhotoModel[];

    public static associations: {
        photos: Association<UserModel, PhotoModel>;
    };
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    displayName: {
        type: new DataTypes.STRING(255),
        allowNull: false,
    },
    username: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    email: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    passwordHash: {
        type: new DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'user',
    },
    bio: {
        type: new DataTypes.STRING(1024),
        allowNull: true,
    },
}, {
    tableName: 'users',
    sequelize,
});

export default UserModel;
