import { User } from "@/types";
import { MOCK_SONGS } from "@/constants/mock-data";

const MOCK_DELAY = 300;

function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY));
}

const MOCK_USER: User = {
  id: "user-1",
  username: "alex.codes",
  avatarUrl: "/placeholder/user-avatar.jpg",
  uploadedSongs: [MOCK_SONGS[0]],
  favorites: [MOCK_SONGS[1], MOCK_SONGS[3]],
  history: [MOCK_SONGS[2], MOCK_SONGS[4], MOCK_SONGS[0]],
};

export const userService = {
  getCurrentUser: (): Promise<User> => delay(MOCK_USER),
};