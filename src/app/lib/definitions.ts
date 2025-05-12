import { UUID } from "crypto";

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