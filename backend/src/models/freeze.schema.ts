import * as mongoose from "mongoose";

export interface FreezeDoc extends mongoose.Document {
    sessionID:  string;
    directory:  string;
    filename:   string;
    timestamp:  number;
    textID?:    string;
}

export const Freeze = mongoose.model<FreezeDoc>('Freeze',
    new mongoose.Schema({
        sessionID: { type: String },
        directory: { type: String },
        filename:  { type: String },
        timestamp: { type: Number },
        textID: { type: String }
    }),
    'freezes');
