import * as request from "request";
import {NextFunction, Request, Response} from "express";
import {api} from "../config/api";

export function getNewLiveReportID(req: Request, res: Response, next: NextFunction) {
    // request new live report on api and add ID to request body
    const url = api.rootUrl + api.initReport;

}
