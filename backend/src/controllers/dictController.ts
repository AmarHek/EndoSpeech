import Dict from '../models/dictSchema';
import fs from 'fs';
import {Request, NextFunction, Response} from "express";
import { Document } from "mongoose";

/*
exports.createExcelDict =  (req, res, next) => {
  let xlsx = require('xlsx');
  let workbook = xlsx.readFile('backend/excels/' + req.file.filename);
  let sheet_name_list = workbook.SheetNames;
  let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  fs.writeFile('backend/excels/' + req.file.filename +".json", JSON.stringify(data), function (err) {
  if (err) {
      return console.log(err);
  }});
  fs.unlinkSync('backend/excels/' + req.file.filename);
  let parsed = parser(data);
  if (typeof (parsed) == "string") {
    res.status(201).json({
      message: parsed,
      dictId: "false"
    });
  } else {
    let fName = req.file.filename.split(".")[0];
    Dict.findOne({
      name: fName
    }).then(res => {
      if (res !== null) {
        fName += "_cpy";
      }
      const dict = new Dict({
        parts: parsed.parts,
        name: fName
      });
      dict.save().then(result => {
        console.log(result._id);
        res.status(201).json({
          message: 'Excel successfully uploaded',
          dictId: result._id
        });
      });
    });


  }
  try {

    var parsed = parser(data);
    var fName = req.file.filename.split(".")[0];

    const endo = new Endo({
      dict: parsed.dict,
      name: fName
    });
    endo.save().then(result => {
      console.log(result._id);
      res.status(201).json({
        message: 'Excel uploaded',
        dictId: result._id
      });
    });
  } catch (error) {
    res.status(201).json({
      message: error.message
    });
  }
}*/

export function createDict(req: Request, res: Response, next: NextFunction): void {
  const endo = new Dict({
    parts: req.body.parts,
    name: req.body.name,
    timestamp: req.body.timestamp
  });
  endo.save().then(result => {
    res.status(201).json({
      message: 'Disease/Category added successfully',
      postId: result._id
    });
  });
}

export function createJSONDict(req: any, res: Response, next: NextFunction): void {
  try {
    const rawData = fs.readFileSync(req.file.path);
    const parts = JSON.parse(rawData.toString());
    const timestamp = new Date();
    const dict = new Dict({
      parts: parts,
      name: req.body.name,
      timestamp: timestamp
    });
    dict.save().then((result: Document) => {
      res.status(201).json({
        message: "TemplateModel added successfully",
        postId: result._id
      });
    });
  } catch (error) {
    console.log(error);
  }
}

export function changeDict(req: Request, res: Response, next: NextFunction): void {
  const newDict = new Dict({
    _id: req.params.id,
    dict: req.body.dict,
    name: req.body.name
  });
  Dict.updateOne({
      _id: req.params.id
    }, newDict)
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Update successful"
      });
    });
}

export function deleteDict(req: Request, res: Response, next: NextFunction): void {
  Dict.deleteOne({
    _id: req.params.id
  }).then(
    result => {
      console.log(result);
      res.status(200).json({
        message: "Post deleted"
      });
    });
}

export function getDicts(req: Request, res: Response, next: NextFunction): void {
  Dict.find()
    .then(dicts => {
      console.log(dicts);
      res.status(200).json({
        message: "Dicts fetched",
        dicts: dicts
      });
    });
}
