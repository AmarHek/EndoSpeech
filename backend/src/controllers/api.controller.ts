import * as request from "request";
import {api} from "../config/api";
import {Request, Response} from "express";
import {RecordDoc} from "../models";
import * as fs from "fs";
import * as Path from "path";

export function submitRecordsAndFreezesToApi(req: Request, res: Response) {
    if (req.body.records === undefined || req.body.records.length === 0) {
        res.status(500).send({message: "Records missing."});
    } else if (req.body.freezes === undefined || req.body.freezes.length === 0 ) {
        res.status(500).send({message: "Freezes missing."});
    } else {
        let errors = 0;
        const freezes = req.body.freezes;
        const records = req.body.records;
        const recordId = req.body.recordId;
        for (const freeze of freezes) {
            const file = loadFreezeAsFile(Path.join(process.cwd(), "./data/freezes", freeze.directory), freeze.filename)
            const description = getRecordContent(records, freeze.textIDs);
            const formData = {
                "description": description,
                "file": file,
                "recordId": recordId
            }
            request.post({url: api.rootUrl + api.postData, formData: formData}, (err, httpResponse, body) => {
                if (err) {
                    console.error('Upload failed:', err);
                    errors++;
                } else {
                    console.log('Upload successful!  Server responded with:', body);
                }
            });
        }
        if (errors > 0) {
            res.status(500).send({message: errors + " files could not be uploaded. Check server logs."});
        } else {
            res.status(200).send({message: "All files uploaded successfully"});
        }
    }
}

function getRecordContent(records: RecordDoc[], recIDs: string[], splitter = "__x__"): string {
    if (recIDs.length === 0) {
        return "";
    } else {
        const result = [];
        for (const recID of recIDs) {
            for (const rec of records) {
                if (rec._id === recID) {
                    result.push(rec.content);
                }
            }
        }
        return result.join(splitter);
    }
}

function loadFreezeAsFile(path: string, filename: string): File {
    const data = fs.readFileSync(Path.join(path, filename));
    return new File([data], filename);
}
