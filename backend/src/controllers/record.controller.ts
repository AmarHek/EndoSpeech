import { Record } from '../models/';
import {NextFunction, Request, Response} from 'express';

export function addRecord(req: Request, res: Response): void {
    const record = new Record( {
        sessionID: req.body.sessionID,
        timestamp: req.body.timestamp,
        content: req.body.content
    });
    console.log(record);
    record.save().then(result => {
        res.status(201).send({
            message: "Records file saved successfully",
            postId: result._id
        });
    });
}

export function getRecordsByID(req: Request, res: Response): void {
    Record.find({ sessionID: req.body.sessionID }).exec(
        (err, records) => {
            if (err) {
                res.status(500).send({message: err});
            }
            res.status(200).send({
                message: "Records fetched",
                records: records
            });
    });
}

export function updateRecordByID(req: Request, res: Response): void {
    Record.updateOne({
            _id: req.body.recordID
        }, {
        content: req.body.newContent
    }).exec(
        (err) => {
            if (err) {
                res.status(500).send({message: err});
            } else {
                res.status(200).send({message: "Update successful"});
            }
        }
    );
}

export function getRecordsByIDMiddleware(req: Request, res: Response, next: NextFunction) {
    Record.find({sessionID: req.body.sessionID}).exec(
        (err, records) => {
            if (err) {
                res.status(500).send({message: "Keine Textaufnahmen gefunden. Haben Sie eine Session gestartet?"});
            } else {
                req.body.records = records;
                next();
            }
        })
}
