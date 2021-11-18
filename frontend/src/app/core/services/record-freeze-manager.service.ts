import { Injectable } from "@angular/core";
import {InputParserService, DictRequestsService, RecordFreezeApiService} from "@app/core";
import {getDateFormatted} from "@app/helpers";
import {Record, Freeze} from "@app/models";
import {HttpClient} from "@angular/common/http";
import {nanoid} from "nanoid";

@Injectable({
  providedIn: "root"
})
export class RecordFreezeManager {

  public records: Record[] = [];
  public reports: string[] = [];
  public freezes: Freeze[] = [];
  public date = "";
  sessionID: string;
  fetched = false;

  constructor(private inputParser: InputParserService,
              private dictManager: DictRequestsService,
              private dataApi: RecordFreezeApiService) {
  }

  resetSession(): void {
    this.records = [];
    this.reports = [];
    this.freezes = [];
    this.sessionID = nanoid();
    this.date = this.date = getDateFormatted(new Date(), true);
  }

  matchFreezesAndRecords() {
    for (const record of this.records) {
      // go through all records and find freeze with minimum time difference
      // each record will be assigned to a freeze
      // diff must be positive, i.e. record comes after the freeze
      let minDiff: number = 100000;
      let freezeIdx: number;
      for (const freeze of this.freezes) {
        // loop through freezes and find freeze with minimum time difference at earlier time than record
        const diff = record.timestamp - freeze.timestamp;
        if (diff < minDiff && diff > 0) {
          minDiff = diff;
          freezeIdx = this.freezes.indexOf(freeze);
        }
        // push textID to proper freeze
        this.freezes[freezeIdx].textIDs.push(record._id);
      }
    }
    // afterwards, update freezes in database
    for (const freeze of this.freezes) {
      this.dataApi.updateFreeze(freeze._id, freeze.textIDs).subscribe(res => console.log(res.message));
    }
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
