import {NextFunction, Request, Response} from "express";
import {Record} from "../models";
import {Freeze} from "../models";

export function getRecordsBySessionIDMiddleware(req: Request, res: Response, next: NextFunction) {
    Record.find({sessionID: req.body.sessionID}).exec(
        // find records and add to request body
        (err, records) => {
            if (err) {
                res.status(500).send({message: "Keine Textaufnahmen gefunden. Haben Sie eine Session gestartet?"});
            } else {
                req.body.records = records;
                next();
            }
        });
}

export function getFreezesBySessionIDMiddleware(req: Request, res: Response, next: NextFunction) {
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

export function loadFreezesAsFiles(req: Request, res: Response, next: NextFunction) {

}
