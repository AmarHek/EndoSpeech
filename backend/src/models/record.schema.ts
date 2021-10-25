import mongoose, {Schema, Document} from 'mongoose';

export interface Record extends Document {
    sessionID:  string;
    timestamp:  Date;
    content:    string;
}


const recordSchema = new Schema({
    sessionID: { type: String },
    timestamp: { type: Date },
    content: { type: String }
});

export default mongoose.model<Record>('Record', recordSchema, "records");
