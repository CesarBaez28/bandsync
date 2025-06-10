import { UUID } from "crypto";

export interface ApiResponse<T = unknown> {
  errors?: T;
  success: boolean;
  message: string;
  timestamp: string;
  data?: T; 
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

export type User = {
  id: UUID;
  username: string;
  accessToken: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  photo: string;
  status: boolean;
};