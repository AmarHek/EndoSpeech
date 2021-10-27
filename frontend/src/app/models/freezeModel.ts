export interface FreezeModel {
  _id?: string;
  sessionID: string;
  directory: string;
  filename: string;
  timestamp: number; // unix timestamp
  textID?: string;
}
