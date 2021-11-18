export interface Freeze {
  _id?: string;
  sessionID: string;
  directory: string;
  filename: string;
  timestamp: number; // unix timestamp
  textIDs: string[];
}
