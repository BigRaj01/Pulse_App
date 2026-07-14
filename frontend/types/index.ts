export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  followers?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  releaseYear: number;
  genre: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  genre: string;
  coverUrl: string;
  duration: number; // seconds
  streamUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  songs: Song[];
  createdBy: string;
}

export interface Wallet {
  address: string;
  usdcBalance: number;
  isDeveloperControlled: boolean;
}

export type TransactionType = "incoming" | "outgoing";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  counterparty: string;
  timestamp: string;
  note?: string;
}

export interface UploadRequest {
  trackName: string;
  artistName: string;
  genre: string;
  description?: string;
  coverImage: File | null;
  audioFile: File | null;
  walletAddress: string;
  paymentMethod: string;
}

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  uploadedSongs: Song[];
  favorites: Song[];
  history: Song[];
}

export type RepeatMode = "off" | "one" | "all";

export interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  volume: number;
  progress: number; // seconds
  shuffle: boolean;
  repeat: RepeatMode;
}