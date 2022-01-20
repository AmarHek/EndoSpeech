import {api} from "../config/api.config";
import {Request, Response} from "express";
import {RecordDoc} from "../models";
import * as fs from "fs";
import * as Path from "path";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data');

export async function submitRecordsAndFreezesToApi(req: Request, res: Response) {
    if (req.body.records === undefined || req.body.records.length === 0) {
        res.status(500).send({message: "Records missing."});
    } else if (req.body.freezes === undefined || req.body.freezes.length === 0) {
        res.status(500).send({message: "Freezes missing."});
    } else {
        let errors = 0;
        const freezes = req.body.freezes;
        const records = req.body.records;

        const recordId = req.body.recordId;


        for (const freeze of freezes) {
            const description = getRecordContent(records, freeze.textIDs);

            const freezePath = Path.join(process.cwd(), "./data/freezes", freeze.directory, freeze.filename)

            //create payload for request
            const formData = new FormData();
            formData.append("description", description);
            formData.append("file", fs.createReadStream(freezePath));
            formData.append("originalName", freezePath);
            formData.append("recordId", recordId);

            await axios.post(api.rootUrl + api.postData,
                formData, {
                    headers: formData.getHeaders(),
                    auth: {
                        username: api.username,
                        password: api.password
                    }
                }).then((response) => {
                console.log(response);
            }).catch((err) => {
                errors += 1;
                console.log(err);
            })
        }
        if (errors > 0) {
            res.status(501).send("Some files caused errors.");
        } else {
            res.status(201).send({message: "All files uploaded successfully"});
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
