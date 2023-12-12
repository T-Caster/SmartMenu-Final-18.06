import UserModel from './user';
import PhotoModel from './photo';

// Define the associations
UserModel.hasMany(PhotoModel, {
    foreignKey: 'userId',
    as: 'photos'
});

PhotoModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'
});

// Export the models with associations set up
export { UserModel, PhotoModel };
