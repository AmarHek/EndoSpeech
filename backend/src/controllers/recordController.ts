import Record from '../models/recordSchema';
import { Request, Response, NextFunction } from 'express';

export function addRecord(req: Request, res: Response, next: NextFunction): void {
    const record = new Record( {
        timestamp: req.body.timestamp,
        content: req.body.content
    });
    record.save().then(result => {
        res.status(201).json({
            message: "Records file saved successfully",
            postId: result._id
        });
    });
}

export function getRecords(req: Request, res: Response, next: NextFunction): void {
    Record.find().then(records => {
        console.log(records);
        res.status(200).json({
            message: "Records fetched",
            records: records
        });
    });
}
