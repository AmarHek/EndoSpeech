import * as express from "express";
import {sendToSerial} from "../controllers/serial.controller";

export const router = express.Router();

router.post("/sendToSerial", sendToSerial);
