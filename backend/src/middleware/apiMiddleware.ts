import axios from "axios";
import {NextFunction, Request, Response} from "express";
import {api} from "../config/api.config";

export function getRecordIdFromApi(req: Request, res: Response, next: NextFunction) {
    const url = api.rootUrl + api.initReport;
    axios.post(url, {}, {
        auth: {
            username: api.username,
            password: api.password
        }
    }).then(
        (response) => {
            console.log("Successfully initiated new Report");
            req.body.recordId = response.data.id;
            next();
        }
    ).catch(err => {
        res.status(500).send({err});
    })
}
