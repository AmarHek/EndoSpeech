import * as express from "express";
import * as fs from 'fs';
import * as multer from 'multer';
import * as FreezeController from "../controllers/freeze.controller";
import { findDirectory, saveFreezesSync} from "../middleware";
import { getRecordsByIDMiddleware } from "../controllers/record.controller";
import {getFreezesAndRecords, onlyGetFreezesAndRecords} from "../controllers/freeze.controller";

export const router = express.Router();

router.post("/add", FreezeController.addFreeze);
router.post("update/:id", FreezeController.updateFreeze);
router.post("/getAll", [
    getRecordsByIDMiddleware,
    findDirectory,
    saveFreezesSync
],
    getFreezesAndRecords)
router.post("/onlyGetAll", onlyGetFreezesAndRecords);
