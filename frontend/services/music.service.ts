import { Song, Album, Artist } from "@/types";
import { MOCK_SONGS, MOCK_ALBUMS, MOCK_ARTISTS } from "@/constants/mock-data";

const MOCK_DELAY = 300;

function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY));
}

export const musicService = {
  getAllSongs: (): Promise<Song[]> => delay(MOCK_SONGS),

  getTrendingSongs: (): Promise<Song[]> => delay(MOCK_SONGS.slice(0, 3)),

  getRecommendedSongs: (): Promise<Song[]> => delay(MOCK_SONGS.slice(1, 4)),

  getSongById: (id: string): Promise<Song | undefined> =>
    delay(MOCK_SONGS.find((s) => s.id === id)),

  getAllAlbums: (): Promise<Album[]> => delay(MOCK_ALBUMS),

  getAlbumById: (id: string): Promise<Album | undefined> =>
    delay(MOCK_ALBUMS.find((a) => a.id === id)),

  getAllArtists: (): Promise<Artist[]> => delay(MOCK_ARTISTS),

  getArtistById: (id: string): Promise<Artist | undefined> =>
    delay(MOCK_ARTISTS.find((a) => a.id === id)),

  searchSongs: (query: string): Promise<Song[]> =>
    delay(
      MOCK_SONGS.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.artist.toLowerCase().includes(query.toLowerCase())
      )
    ),
};