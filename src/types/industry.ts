
import { LucideIcon } from 'lucide-react';

export interface IndustryData {
  name: string;
  icon: string;
  color: string;
  accentColor: string;
  textColor: string;
  buttonColor: string;
  image: string;
  description: string;
  longDescription: string;
  keyRoles: string[];
  challenges: string[];
  stats: string[];
  lucideIcon: LucideIcon;
}

export type IndustriesDataType = {
  [key: string]: IndustryData;
};
