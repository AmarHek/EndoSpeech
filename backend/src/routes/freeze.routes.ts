import * as express from "express";
import * as FreezeController from "../controllers/freeze.controller";
import { findDirectory } from "../middleware";
import { getRecordsByIDMiddleware } from "../controllers/record.controller";
import {getFreezesBySessionID, getFreezesAndRecords, saveFreezesSync} from "../controllers/freeze.controller";

export const router = express.Router();

router.post("/add", FreezeController.addFreeze);
router.post("/update", FreezeController.updateFreeze);
router.post("/fetch", [
    getRecordsByIDMiddleware,
    findDirectory,
],
    saveFreezesSync);
router.post("/getAll", getFreezesAndRecords);
router.post("/getFreezes", getFreezesBySessionID);
