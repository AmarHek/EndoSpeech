import * as express from "express";
import {getNewLiveReportID, loadFreezesAsFiles} from "../middleware";
import {getRecordsBySessionIDMiddleware, getFreezesBySessionIDMiddleware} from "../middleware";
import {submitRecordsAndFreezesToApi} from "../controllers/api.controller";

export const router = express.Router();

router.post("/submitToApi", [
    loadFreezesAsFiles,
    getNewLiveReportID
],
   submitRecordsAndFreezesToApi);
