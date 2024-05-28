import { Friendship } from 'src/friendship/profile-contact.model';

export const getUniqueProfiles = (
  friendships: Friendship[],
  profileId: number,
) => {
  const friends = [];
  for (const friendship of friendships) {
    if (friendship.profile && friendship.profile.id !== profileId) {
      friends.push(friendship.profile);
    }
    if (friendship.friend && friendship.friend.id !== profileId) {
      friends.push(friendship.friend);
    }
  }

  // Удаляем дублирующиеся профили
  const uniqueFriends = Array.from(
    new Set(friends.map((friend) => friend.id)),
  ).map((id) => friends.find((friend) => friend.id === id));

  return uniqueFriends;
};
