import {Injectable} from "@angular/core";
import {DictRequestsService, InputParserService, RecordFreezeApiService} from "@app/core";
import {Freeze, Record} from "@app/models";
import {nanoid} from "nanoid";

@Injectable({
  providedIn: "root"
})
export class RecordFreezeManager {

  records: Record[] = [];
  reports: string[] = [];
  freezes: Freeze[] = [];
  date: Date;
  sessionID: string;
  fetched = false;
  loaded = false;

  constructor(private inputParser: InputParserService,
              private dictManager: DictRequestsService,
              private dataApi: RecordFreezeApiService) {
  }

  resetSession(): void {
    this.records = [];
    this.reports = [];
    this.freezes = [];
    this.sessionID = nanoid();
    this.date = new Date();
    this.fetched = false;
    this.loaded = false;
  }

  matchFreezesAndRecords() {
    // empty all freezes first
    for (const freeze of this.freezes) {
      console.log(freeze);
      freeze.textIDs = [];
    }
    for (const record of this.records) {
      // go through all records and find freeze with minimum time difference
      // each record will be assigned to a freeze
      // diff must be positive, i.e. record comes after the freeze
      let minDiff: number = 10000000;
      let freezeIdx: number = -1;
      for (const freeze of this.freezes) {
        // loop through freezes and find freeze with minimum time difference at earlier time than record
        const diff = record.timestamp - freeze.timestamp;
        if (diff < minDiff && diff > 0) {
          minDiff = diff;
          freezeIdx = this.freezes.indexOf(freeze);
        }
      }
      if(freezeIdx < this.freezes.length){
        // push textID to proper freeze
        if (!this.freezes[freezeIdx].textIDs.includes(record._id)) {
          this.freezes[freezeIdx].textIDs.push(record._id);
        }
      }
    }
    // afterwards, update freezes in database
    for (const freeze of this.freezes) {
      this.dataApi.updateFreeze(freeze._id, freeze.textIDs).subscribe(res => console.log(res.message));
    }

    this.updateDate();
  }

  updateDate() {
    if (this.freezes.length > 0) {
      this.date = new Date(this.freezes[0].timestamp * 1000);
    }
  }

  getRecordContent(recIDs: string[], splitter: string): string {
    if(recIDs.length === 0) {
      return "";
    } else {
      const result = [];
      for (const recID of recIDs) {
        for (const rec of this.records) {
          if (rec._id === recID) {
            result.push(rec.content);
          }
        }
      }
      return result.join(splitter);
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
