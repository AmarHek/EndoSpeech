import express from "express";
import fs from 'fs';
import multer from 'multer';

import * as DictController from "../controllers/dictController";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = "data/excels";
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    //const ext = file.mimetype;
    cb(null, name + ".xlsx");
  }
});

const storageJSON = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = "data/json";
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const name = file.originalname;
    cb(null, name);
  }
});

export const router = express.Router();

/*
router.post("/excels", multer({
  storage: storage
}).single("file"), DictController.createExcelDict );*/
router.post("/json", multer({
  storage: storageJSON
}).single("file"), DictController.createJSONDict);
router.post("", DictController.createDict);
router.put("/:id", DictController.changeDict );
router.get('', DictController.getDicts);
router.post("/single", DictController.getDictByName);
router.delete("/:id", DictController.deleteDict);



