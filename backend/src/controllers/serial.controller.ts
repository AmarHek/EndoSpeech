import {Request, Response} from 'express';
import {SerialWriter} from "../tools";


const serialWriter = new SerialWriter();

export function sendToSerial(req: Request, res: Response): void {
    serialWriter.write(req.body.report);
    res.status(200).send({message: "Message sent"})
}