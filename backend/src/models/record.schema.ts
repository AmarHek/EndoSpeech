import mongoose from 'mongoose';

export interface RecordDoc extends mongoose.Document {
    sessionID:  string;
    timestamp:  number;
    content:    string;
}


const recordSchema = new mongoose.Schema({
    sessionID: { type: String },
    timestamp: { type: Number },
    content: { type: String }
});

export const Record = mongoose.model<RecordDoc>('Record', recordSchema, "records");
