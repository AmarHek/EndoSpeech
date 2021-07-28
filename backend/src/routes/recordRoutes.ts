import express from "express";

import * as RecordController from "../controllers/recordController";

export const router = express.Router();

router.post("/record", RecordController.addRecord);
router.get('/record', RecordController.getRecords);


