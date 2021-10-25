import Record from '../models/record.schema';
import { Request, Response, NextFunction } from 'express';

export function addRecord(req: Request, res: Response, next: NextFunction): void {
    const record = new Record( {
        sessionID: req.body.sessionID,
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

export function getRecordsByID(req: Request, res: Response, next: NextFunction): void {
    Record.find({ sessionID: req.body.sessionID }).exec(
        (err, records) => {
            if (err) {
                res.status(500).send({message: err});
            }
            res.status(200).json({
                message: "Records fetched",
                records: records
            });
    });
}
