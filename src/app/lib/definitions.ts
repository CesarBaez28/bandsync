import { UUID } from "crypto";

export interface ApiResponse<T = unknown> {
  errors?: T;
  success: boolean;
  message: string;
  timestamp: string;
  data?: T; 
}

export interface PagedData<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type MusicalBand = {
  id: UUID;
  name: string;
  hyphenatedName: string;
  logo: string;
  address: string;
  phone: string
  email: string
  status: boolean
};

export type Artist = {
  id: number;
  name: string;
  status: boolean;
};

export type MusicalGenre = {
  id: number;
  name: string;
  status: boolean;
};

export type MusicalRole = {
  id: number;
  name: string;
  status: boolean;
};

export type Song = {
  id: number;
  name: string;
  artist: Artist;
  genre: MusicalGenre;
  tonality: string;
  link: string;
  sheetMusic: string;
};

export type Repertoire = {
  id: UUID;
  name: string;
  description: string;
  link: string;
  status: boolean;
}

export type User = {
  id: UUID;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  photo: string;
  status: boolean;
};

export type UserSesion = User & {
  accessToken: string;
  musicalBands: MusicalBand[];
}