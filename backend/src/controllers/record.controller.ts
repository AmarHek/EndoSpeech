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
            recordID: result._id
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
    console.log(req.body);
    Record.updateOne({
            _id: req.body.recordID
        }, {
        content: req.body.content
    }).exec(
        (err) => {
            if (err) {
                res.status(500).send({message: err});
            } else {
                res.status(200).send({message: "Update successful"});
            }
        });
}

export function deleteRecordByID(req: Request, res: Response): void {
    Record.deleteOne({
        _id: req.body.recordID
    }).exec((err) => {
        if (err) {
            res.status(500).send({message: err});
        } else {
            res.status(200).send({message: "Successfully deleted record"});
        }
    });
}


