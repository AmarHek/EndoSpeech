import * as mongoose from "mongoose";

export interface FreezeDoc extends mongoose.Document {
    sessionID:  string;
    directory:  string;
    filename:   string;
    timestamp:  number;
    textIDs:    string[];
}

export const Freeze = mongoose.model<FreezeDoc>('Freeze',
    new mongoose.Schema({
        sessionID: { type: String },
        directory: { type: String },
        filename:  { type: String },
        timestamp: { type: Number },
        textIDs:   { type: Array }
    }),
    'freezes');
