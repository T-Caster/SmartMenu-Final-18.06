import UserModel from './user';
import PhotoModel from './photo';
import TableAttendeeModel from './tableAttendees';
import TableModel from './table';
import CommentModel from './comment';

// Define the associations
UserModel.hasMany(PhotoModel, {
    foreignKey: 'userId',
    as: 'photos'
});

PhotoModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user'
});

UserModel.hasMany(CommentModel, { foreignKey: 'userId', as: 'comments' });
TableModel.hasMany(CommentModel, { foreignKey: 'tableId', as: 'comments' });

// Export the models with associations set up
export { UserModel, PhotoModel, TableModel, TableAttendeeModel, CommentModel };
