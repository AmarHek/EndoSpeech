import {NextFunction, Request, Response} from "express";
import {Record} from "../models";
import {Freeze} from "../models";

export function getRecordsBySessionIDMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.body.records !== undefined) {
        next();
    } else {
        Record.find({sessionID: req.body.sessionID}).exec(
            // find records and add to request body
            (err, records) => {
                if (err) {
                    res.status(500).send({message: err});
                } else {
                    if (records.length > 0) {
                        req.body.records = records;
                        next();
                    } else {
                        res.status(200).send({message: "Keine Aufnahmen gefunden."});
                    }
                }
            });
    }
}

export function getFreezesBySessionIDMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.body.freezes !== undefined) {
        next();
    } else {
        Freeze.find({sessionID: req.body.sessionID}).exec(
            // find freezes in database
            (err, freezes) => {
                if (err) {
                    res.status(500).send({message: "Keine Freezes gefunden."});
                } else {
                    req.body.freezes = freezes;
                    next();
                }
            });
    }
}
