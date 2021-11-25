import * as express from "express";
import { findDirectory, getRecordsBySessionIDMiddleware } from "../middleware";
import {addFreeze, getFreezesBySessionID, saveFreezesSync, updateFreeze} from "../controllers/freeze.controller";

export const router = express.Router();

router.post("/add", addFreeze);
router.post("/update", updateFreeze);
router.post("/fetch", [
    getRecordsBySessionIDMiddleware,
    findDirectory,
],
    saveFreezesSync);
router.post("/getFreezes", getFreezesBySessionID);
