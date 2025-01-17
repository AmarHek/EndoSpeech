import express from "express";

import * as RecordController from "../controllers/record.controller";

export const router = express.Router();

router.post("/addRecord", RecordController.addRecord);
router.post('/getRecords', RecordController.getRecordsByID);
router.post('/updateRecord', RecordController.updateRecordByID);
router.post('/deleteRecord', RecordController.deleteRecordByID);
