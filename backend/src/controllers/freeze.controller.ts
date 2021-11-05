import {Freeze, FreezeDoc, Record} from "../models";
import {NextFunction, Request, Response} from 'express';
import Path from "path";
import fs from "fs";

let IMAGE_DIR: string;
if (process.env.NODE_ENV === "production") {
    IMAGE_DIR = "\\\\Vcwdapp\\storage$\\SHORTTERM\\0\\0\\";
} else {
    IMAGE_DIR = Path.join(__dirname, "../../data/examples/");
}

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

export function saveFreezesSync(req: Request, res: Response) {
    const freezes = req.body.freezes;
    const sessionID = req.body.sessionID;
    console.log(req.body.directory);
    const savePath = Path.join(__dirname, "../../data/freezes", req.body.directory);

    if (req.body.freezes.length === 0) {
        res.status(500).send({message: "Keine Dateien im Ordner gefunden. Bitte manuell auswählen."});
    } else {
        if(!fs.existsSync(savePath)) {
            fs.mkdirSync(savePath);
        }
        const newFreezes: FreezeDoc[] = [];
        freezes.map((freeze: string) => {
            const freezeStats = fs.statSync(Path.join(IMAGE_DIR, req.body.directory, freeze));
            Freeze.find({
                sessionID: sessionID,
                directory: req.body.directory,
                filename: freeze,
                timestamp: Math.round(+freezeStats.mtime/1000)
            }).then(res => {
                    if (res.length === 0) {
                        const freezeDB = new Freeze({
                            sessionID: sessionID,
                            directory: req.body.directory,
                            filename: freeze,
                            timestamp: Math.round(+freezeStats.mtime / 1000)
                        });

                        freezeDB.save().then((newFreeze) => {
                            newFreezes.push(newFreeze);
                            fs.copyFileSync(Path.join(IMAGE_DIR, req.body.directory, freeze), Path.join(savePath, freeze));
                        });
                    } else {
                        console.log("Already exists");
                    }
                }
            )
        })
        req.body.freezes = newFreezes;
        res.status(200).send({message: "Freezes erfolgreich geladen."});
    }
}

export function getFreezesAndRecords(req: Request, res: Response): void {
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
