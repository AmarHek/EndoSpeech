import { Injectable } from "@angular/core";
import {InputParserService} from "../services/input-parser.service";
import {getAllIndexOf, splitStringFromIndexes} from "../../helper-classes/util";
import {Observable} from "rxjs";
import {Recording} from "../../helper-classes/recording";

@Injectable({
  providedIn: "root"
})
export class HtmlOutputService {

  public images: string[] = [];
  public texts: string[] = [];
  public reports: string[] = [];
  public date = "";

  constructor(private inputParser: InputParserService) {
  }

  readImages(imagefiles: Array<File>) {
    this.images = [];
    for (const file of imagefiles) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (_event) => {
        this.images.push(reader.result as string);
      };
    }
  }

  extractText(files: Recording[]) {
    for (const file of files) {
      this.texts.push(file.content);
    }
  }

  /*
  async readText(textfiles: Array<File>) {
    this.texts = [];
    for (const file of textfiles) {
      const text = await file.text();
      this.texts.push(text);
    }
    this.splitDiseases();
  }*/

  splitDiseases() {
    let splitTexts: string[] = [];
    const diseases = ["polyp", "divertikulose"];
    for (const text of this.texts) {
      let indexes: number[] = [];
      for (const disease of diseases) {
        indexes = indexes.concat(getAllIndexOf(disease, text, false));
      }
      splitTexts = splitTexts.concat(splitStringFromIndexes(text, indexes));
    }
    this.texts = splitTexts;
  }

  parseText() {
    if (this.texts.length > 0) {
      console.log(this.texts);
      this.reports = [];
      for (const text of this.texts) {
        this.reports.push(this.inputParser.parseInput(text));

        this.extractDate();
      }
      console.log(this.reports);
    } else {
      console.log("No text files available.");
    }
  }

  extractDate() {
    if (this.reports.length > 0) {
      this.date = this.reports[0].substring(0, 16);
      for (let i = 0; i < this.reports.length; i++) {
        // this.reports[i] = this.reports[i].substring(18, this.reports.length);
      }
    }
  }

}
