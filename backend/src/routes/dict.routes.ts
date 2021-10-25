import express from "express";
import fs from 'fs';
import multer from 'multer';

import * as DictController from "../controllers/dict.controller";

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
router.post("/middleware", multer({
  storage: storage
}).single("file"), DictController.createExcelDict );*/
router.post("/json", multer({
  storage: storageJSON
}).single("file"), DictController.createJSONDict);
router.post("", DictController.createDict);
router.put("/:id", DictController.updateDict );
router.get('', DictController.getDictList);
router.post("/single", DictController.getDictByName);
router.delete("/:id", DictController.deleteDict);



