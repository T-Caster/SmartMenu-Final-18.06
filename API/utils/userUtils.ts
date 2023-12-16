import { UserModel, PhotoModel } from '../DB/associations';
import { Profile } from '../models/profile';

export const getUserProfile = (user: UserModel): Profile => {
    const userPhotos = user.photos || [];
    const mainPhoto = userPhotos.find(photo => photo.isMain);
    const profile: Profile = {
        username: user.username,
        displayName: user.displayName,
        image: mainPhoto?.url,
        bio: user.bio,
        photos: userPhotos.map(photo => ({
            id: photo.id.toString(),
            url: photo.url,
            isMain: photo.isMain
        }))
    };

    return profile;
}
