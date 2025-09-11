import { SafeUserProfile, User } from "../interfaces/UserInterface";
import { avatarPath } from "../utilities/general";

export const toSafeUserProfile = (user: User): SafeUserProfile => {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    avatar: avatarPath(user.avatar),
    mobile: user.mobile,
    gender: user.gender,
    status: user.status,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};
