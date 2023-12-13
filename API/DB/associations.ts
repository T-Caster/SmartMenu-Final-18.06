import UserModel from './user';
import PhotoModel from './photo';
import TableAttendeeModel from './tableAttendees';
import TableModel from './table';

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
export { UserModel, PhotoModel, TableModel, TableAttendeeModel };
