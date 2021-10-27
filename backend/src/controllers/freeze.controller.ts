import {Freeze, Record} from "../models";
import { Request, Response } from 'express';

export function addFreeze(req: Request, res: Response): void {
    const freeze = new Freeze({
        sessionID: req.body.sessionID,
        directory: req.body.directory,
        filename: req.body.filename,
        timestamp: req.body.timestamp,
        textID: req.body.textID
    });

    freeze.save().then(() => {
        res.status(201).send({ message: "Freeze saved successfully"})
    })
}

export function updateFreeze(req: Request, res: Response): void {
    Freeze.updateOne({
        _id: req.body.freezeID
    }, {$set: {textID: req.body.textID}}).exec((err) => {
        if (err) {
            res.status(500).send({message: err})
        } else {
            res.status(200).send({
                message: "Freeze Update successful"
            })
        }
    })
}

export function getFreezesAndRecords(req: Request, res: Response): void {
    const records = req.body.records;
    const freezes = req.body.freezes;
    console.log(records, freezes);
    if (freezes.length > 0 && records.length > 0) {
            res.status(201).send({
                freezes: freezes,
                records: records,
                message: "All done"
            });
    } else {
            res.status(200).send({message: "Fertig geladen"});
    }
}

export function onlyGetFreezesAndRecords(req: Request, res: Response): void {
    Freeze.find({
        sessionID: req.body.sessionID
    }).exec((err, freezes) => {
        if (err) {
            res.status(500).send({message: "Etwas ist bei Freezes schief gelaufen"});
        }
        Record.find({
            sessionID: req.body.sessionID
        }).exec((err, records) => {
            if(err) {
                res.status(500).send({message: "Etwas ist bei Records schief gelaufen"});
            }
            if (freezes.length > 0 && records.length > 0) {
                res.status(201).send({
                    freezes: freezes,
                    records: records,
                    message: "All done"
                });
            }
        })
    });
}
