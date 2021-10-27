import { Injectable } from "@angular/core";
import {InputParserService, DictRequestsService, RecordRequestsService} from "@app/core";
import {getDateFormatted} from "@app/helpers";
import {RecordModel, Dict, FreezeModel} from "@app/models";
import * as M from "@app/models/dictModel";
// import cond2 from "../../helpers/cond2.json";

@Injectable({
  providedIn: "root"
})
export class TableOutputService {

  public records: RecordModel[] = [];
  public reports: string[] = [];
  public date = "";
  sessionID: string;
  // sessionID = "7Pqj3AMIHQg5jrHYMJ8c9";

  private dict: Dict;

  constructor(private inputParser: InputParserService,
              private dictManager: DictRequestsService,
              private recordManager: RecordRequestsService) {
    this.date = getDateFormatted(new Date(), true);
  }

  reset(): void {
    this.records = [];
    this.reports = [];
  }

  matchFreezesAndRecords(freezes: FreezeModel[], records: RecordModel[]) {
    for (const freeze of freezes) {
      let minDiff: number = 100000;
      let textID: string = "";
      for (const record of records) {
        const diff = record.timestamp - freeze.timestamp;
        if (diff < minDiff && diff > 0) {
          minDiff = diff;
          textID = record._id;
        }
      }
      freeze.textID = textID;
      this.recordManager.updateFreeze(freeze._id, freeze.textID).subscribe(res => console.log(res.message));
    }
    return freezes;
  }

/*
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
  }*/

}
