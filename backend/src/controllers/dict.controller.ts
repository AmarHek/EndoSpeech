import Dict from '../models/dict.schema';
import fs from 'fs';
import {Request, Response} from "express";
import { Document } from "mongoose";

/*
exports.createExcelDict =  (req, res, next) => {
  let xlsx = require('xlsx');
  let workbook = xlsx.readFile('backend/middleware/' + req.file.filename);
  let sheet_name_list = workbook.SheetNames;
  let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  fs.writeFile('backend/middleware/' + req.file.filename +".json", JSON.stringify(data), function (err) {
  if (err) {
      return console.log(err);
  }});
  fs.unlinkSync('backend/middleware/' + req.file.filename);
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

export function createDict(req: Request, res: Response): void {
  const endo = new Dict({
    parts: req.body.parts,
    name: req.body.name,
    timestamp: req.body.timestamp
  });
  endo.save().then(result => {
    res.status(201).send({
      message: 'Dictionary updated successfully',
      postId: result._id
    });
  });
}

export function createJSONDict(req: any, res: Response): void {
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
      res.status(201).send({
        message: "Dictionary added successfully",
        postId: result._id
      });
    });
  } catch (error) {
    console.log(error);
  }
}

export function updateDict(req: Request, res: Response): void {
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
      res.status(200).send({
        message: "Update successful"
      });
    });
}

export function deleteDict(req: Request, res: Response): void {
  Dict.deleteOne({
    _id: req.params.id
  }).then(
    result => {
      console.log(result);
      res.status(200).send({
        message: "Dictionary deleted"
      });
    });
}

export function getDictList(req: Request, res: Response): void {
  Dict.find()
    .exec((err, dicts) => {
      if (err) {
        res.status(500).send({message: err});
      }
      res.status(200).send(dicts);
    });
}

export function getDictById(req: Request, res: Response): void {
  Dict.find({_id: req.params.id}).exec(
      (err, dict) => {
        if (err) {
          res.status(500).send({message: err});
        }
        res.status(200).send({
          message: "Dictionary found",
          dict: dict
        });
      }
  )
}
