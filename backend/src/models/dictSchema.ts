import mongoose, {Schema, Document} from 'mongoose';
import * as M from './dictModel';

export interface DictDB extends Document {
    parts:      M.TopLevel[];
    name:       string;
    timestamp:  Date;
}

const dictSchema = new Schema({
    parts: { type: mongoose.Schema.Types.Mixed, required: true},
    name: { type: String},
    timestamp: { type: Date }
});

export default mongoose.model<DictDB>('Dict', dictSchema, 'dicts')
