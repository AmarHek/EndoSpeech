import * as request from "request";
import {NextFunction, Request, Response} from "express";
import {api} from "../config/api";

export function getRecordIdFromApi(req: Request, res: Response, next: NextFunction) {
    // request new live report on api and add ID to request body
    console.log("fake get api");
    const url = api.rootUrl + api.initReport;
    request.post(url, {}, (err, response, body) => {
        if (err) {
            console.error(err);
            res.status(500).send({message: err});
        } else {
            req.body.recordId = body.recordId;
            next();
        }
    }).auth(api.username, api.password);
}
