import {Component, OnInit} from "@angular/core";
import {RecordFreezeManager} from "@app/core/services/record-freeze-manager.service";
import {MatDialog} from "@angular/material/dialog";
import {RecordFreezeApiService} from "@app/core";
import {environment} from "@env/environment.prod";
import {getDateFormatted} from "@app/helpers";

const SESSION_ID_STORAGE = "sessionID";

@Component({
  selector: "app-output-display",
  templateUrl: "./record-output.component.html",
  styleUrls: ["./record-output.component.scss"]
})
export class RecordOutputComponent implements OnInit {

  baseUrl = environment.backend + "freezes/";
  files: File[];

  constructor(private dataManager: RecordFreezeManager,
              private dialog: MatDialog,
              private dataApi: RecordFreezeApiService) { }

  ngOnInit(): void {
    this.loadFreezes();
  }

  get freezes() {
    return this.dataManager.freezes;
  }

  get records() {
    return this.dataManager.records;
  }

  get date() {
    return getDateFormatted(this.dataManager.date, true);
  }

  get loaded() {
    return this.dataManager.loaded;
  }

  get sessionID() {
    return this.dataManager.sessionID;
  }

  loadFreezes() {
    if (this.dataManager.sessionID !== undefined && !this.dataManager.fetched) {
      this.dataApi.fetchFreezesToBackend(this.dataManager.sessionID).subscribe(res => {
          console.log(res.message);
          this.dataManager.fetched = true;
        },
        err => {
          console.log(err.message);
          this.dataManager.fetched = false;
        });
    }
  }

  showImages() {
    if (this.dataManager.fetched) {
      this.dataApi.getFreezesBySessionID(this.dataManager.sessionID).subscribe(res => {
        this.dataManager.freezes = res.freezes;
        this.dataManager.matchFreezesAndRecords();
        this.dataManager.loaded = true;
      });
    } else if (this.dataManager.records.length === 0) {
      window.alert("Keine Aufnahmen gefunden. Wurde eine Session gestartet?");
    } else if (this.dataManager.freezes.length === 0) {
      window.alert("Keine Freezes gefunden.");
    }
  }

  loadPreviousSession() {
    const oldID = localStorage.getItem(SESSION_ID_STORAGE);
    this.dataManager.sessionID = oldID;
    this.dataApi.getRecordsBySessionID(oldID).subscribe((res) => {
      this.dataManager.records = res.records;
      this.dataApi.getFreezesBySessionID(oldID).subscribe((res) => {
        this.dataManager.freezes = res.freezes;
        this.dataManager.matchFreezesAndRecords();
        this.dataManager.loaded = true;
      });
    });
  }

  resetSession(): void {
    let res = true;
    if (this.dataManager.records.length > 0) {
      res = window.confirm("Warnung: Aktuell bestehende Aufnahmen werden überschrieben.");
    }
    if (res === true) {
      this.dataManager.resetSession();
    }
  }

  submitRecords() {
    this.dataApi.saveToApi(
      this.dataManager.sessionID,
      this.dataManager.records,
      this.dataManager.freezes).subscribe((res) => {
      window.alert(res.message);
    }, (err) => {
        console.log(err);
        window.alert(err.error);
    });
  }

  getRecordContent(recIDs: string[], splitter: string) {
    return this.dataManager.getRecordContent(recIDs, splitter);
  }

  sendTextToSerial(report: string): void {
    this.dataApi.sendToSerial(report);
  }
}
