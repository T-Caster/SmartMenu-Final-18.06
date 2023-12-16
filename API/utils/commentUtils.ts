import { CommentModel, PhotoModel, UserModel } from '../DB/associations';
import { ChatComment } from '../models/comment';
import { getUserProfile } from './userUtils';

export const getChatComment = async (commentId: number): Promise<ChatComment | null> => {
    try {
        const comment = await CommentModel.findByPk(commentId, {
            include: [{
                model: UserModel,
                as: 'user', // Match the association alias if defined
                include: [{
                    model: PhotoModel,
                    as: 'photos', // Match the association alias if defined
                }]
            }]
        });

        if (!comment || !comment.user) {
            console.error("Comment or User not found");
            return null;
        }

        const userData = getUserProfile(comment.user);
        const commentData: ChatComment = {
            id: comment.id,
            body: comment.body,
            createdAt: comment.createdAt,
            displayName: userData.displayName,
            username: userData.username,
            image: userData.image // Assuming you want to include the user's image
        };

        return commentData;

    } catch (error) {
        console.error("Error fetching comment: ", error);
        return null;
    }
}