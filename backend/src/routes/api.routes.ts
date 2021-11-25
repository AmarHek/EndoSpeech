import * as express from "express";
import {getRecordIdFromApi} from "../middleware";
import {getRecordsBySessionIDMiddleware, getFreezesBySessionIDMiddleware} from "../middleware";
import {submitRecordsAndFreezesToApi} from "../controllers/api.controller";

export const router = express.Router();

router.post("/submit", [
    getRecordsBySessionIDMiddleware,
    getFreezesBySessionIDMiddleware,
    getRecordIdFromApi
],
   submitRecordsAndFreezesToApi);
