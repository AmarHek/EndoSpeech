export interface Record {
  _id?: string;
  sessionID: string;
  content: string;
  timestamp: number; // unix timestamp
}
