import { Injectable } from "@angular/core";
import {InputParserService, DictRequestsService} from "@app/core";
import {getDateFormatted} from "@app/helpers";
import {RecordModel, Dict} from "@app/models";
import * as M from "@app/models/dictModel";

@Injectable({
  providedIn: "root"
})
export class TableOutputService {

  public images: string[] = [];
  public records: RecordModel[] = [];
  public reports: string[] = [];
  public date = "";

  private dict: Dict;

  constructor(private inputParser: InputParserService,
              private dictManager: DictRequestsService) {
    this.date = getDateFormatted(new Date(), true);
    this.initInputparser();
  }

  reset(): void {
    this.images = [];
    this.records = [];
    this.reports = [];
  }


  initInputparser(): void {
    this.dictManager.getList()
      .subscribe((list: M.Dict[]) => {
        this.dict = list.find((d) => d.name === "cond2");
        if (this.dict === undefined) {
          console.log("Dieses Dictionary existiert nicht! " +
            "Bitte auf List Seite zurückkehren und eines der dort aufgeführten Dictionaries auswählen.");
        } else {
          if (!this.inputParser.start) {
            this.inputParser.createStartDict(this.dict.parts);
            this.inputParser.start = true;
          }
        }
      });
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

  /*
  splitDiseases() {
    let splitTexts: string[] = [];
    const diseases = ["polyp", "divertikulose"];
    for (const record of this.records) {
      let indexes: number[] = [];
      for (const disease of diseases) {
        indexes = indexes.concat(getAllIndexOf(disease, text, false));
      }
      splitTexts = splitTexts.concat(splitStringFromIndexes(text, indexes));
    }
    this.texts = splitTexts;
  } */

  getReports(): string[] {
    if (this.records.length > 0) {
      this.reports = [];
      let reportTemp: string;
      console.log(this.reports);
      for (const record of this.records) {
        reportTemp = this.inputParser.parseInput(record.content);
        console.log(this.inputParser.parseInput(record.content));
      }
      this.reports = reportTemp.split("\n\n");
      this.reports.shift();
      return this.reports;
    } else {
      console.log("No text files available.");
      return [];
    }
  }

  getFreetext(): string[] {
    const freetext = [];
    for (const record of this.records) {
      freetext.push(record.content);
    }
    return freetext;
  }

  getTimestamps(): string[] {
    const timestamps = [];
    for (const record of this.records) {
      timestamps.push(record.timestamp.getHours() + ":" + record.timestamp.getMinutes());
    }
    return timestamps;
  }

  /*
  extractDate() {
    if (this.reports.length > 0) {
      this.date = this.reports[0].substring(0, 16);
      for (let i = 0; i < this.reports.length; i++) {
        // this.reports[i] = this.reports[i].substring(18, this.reports.length);
      }
    }
  }*/

}
