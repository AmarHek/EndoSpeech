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

  loaded = false;
  fetched = false;

  constructor(private dataManager: RecordFreezeManager,
              private dialog: MatDialog,
              private dataApi: RecordFreezeApiService) { }

  ngOnInit(): void {
    this.dataManager.date = undefined;
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

  loadFreezes() {
    if (this.dataManager.sessionID !== undefined) {
      this.dataApi.fetchFreezesToBackend(this.dataManager.sessionID).subscribe(res => {
          console.log(res.message);
          this.fetched = true;
        },
        err => {
          console.log(err.message);
          this.fetched = false;
        });
    }
  }

  showImages() {
    if (this.fetched) {
      this.dataApi.getFreezesBySessionID(this.dataManager.sessionID).subscribe(res => {
        this.dataManager.freezes = res.freezes;
        this.dataManager.matchFreezesAndRecords();
        this.loaded = true;
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
        this.loaded = true;
      });
    });
  }

  submitRecords() {
    this.dataApi.getApiRecordID().subscribe((res) => {
      const recID = res.id;
      for (const freeze of this.freezes) {
        const imageUrl = this.baseUrl + freeze.directory + "/" + freeze.filename;
        this.dataApi.getFreezeAsFile(imageUrl).subscribe(data => {
          let imageFile = new File([data], freeze.filename);
          const text = this.getRecordContent(freeze.textIDs, "__x__");
          console.log(imageFile, text);
          this.dataApi.saveToApi(imageFile, text, recID).subscribe(res => {
            console.log("Success", res);
            },
            err => {
              window.alert("Fehler: " + err.message);
              console.log(err);
            });
          });
        }
      },
      err => {
        window.alert("Fehler: " + err.message);
        console.log(err);
      });
  }

  getRecordContent(recIDs: string[], splitter: string) {
    return this.dataManager.getRecordContent(recIDs, splitter);
  }

}
