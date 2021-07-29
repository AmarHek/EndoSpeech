import express from "express";
import bodyParser from "body-parser";

import * as RecordController from "../controllers/recordController";

export const router = express.Router();

router.post("/addRecord", RecordController.addRecord);
router.post('/getRecord', RecordController.getRecordsByID);


