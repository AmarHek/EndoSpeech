import { Injectable } from "@angular/core";
import {InputParserService, DictRequestsService, RecordFreezeApiService} from "@app/core";
import {getDateFormatted} from "@app/helpers";
import {Record, Freeze} from "@app/models";
import {HttpClient} from "@angular/common/http";

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
    this.date = getDateFormatted(new Date(), true);
  }

  reset(): void {
    this.records = [];
    this.reports = [];
  }

  matchFreezesAndRecords() {
    for (const freeze of this.freezes) {
      let minDiff: number = 100000;
      let textID: string = "";
      for (const record of this.records) {
        const diff = record.timestamp - freeze.timestamp;
        if (diff < minDiff && diff > 0) {
          minDiff = diff;
          textID = record._id;
        }
      }
      freeze.textID = textID;
      this.dataApi.updateFreeze(freeze._id, freeze.textID).subscribe(res => console.log(res.message));
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
