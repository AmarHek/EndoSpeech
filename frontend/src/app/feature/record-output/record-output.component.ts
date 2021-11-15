import {Component, OnInit} from "@angular/core";
import {RecordFreezeManager} from "@app/core/services/record-freeze-manager.service";
import {MatDialog} from "@angular/material/dialog";
import {MatDialogService, RecordFreezeApiService} from "@app/core";
import {environment} from "@env/environment.prod";
import {LoginComponent} from "@app/shared";

@Component({
  selector: "app-output-display",
  templateUrl: "./record-output.component.html",
  styleUrls: ["./record-output.component.scss"]
})
export class RecordOutputComponent implements OnInit {

  baseUrl = environment.backend + "freezes/";
  date: string;

  files: File[];

  loaded = false;
  fetched = false;

  constructor(private dataManager: RecordFreezeManager,
              private dialog: MatDialog,
              private dataApi: RecordFreezeApiService,
              private dialogService: MatDialogService) { }

  ngOnInit(): void {
    this.date = this.dataManager.date;
    this.loadFreezes();
  }

  get freezes() {
    return this.dataManager.freezes;
  }

  get records() {
    return this.dataManager.records;
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
    } else if (this.dataManager.freezes.length === 0) {
      window.alert("Keine Freezes gefunden.");
    } else if (this.dataManager.records.length === 0) {
      window.alert("Keine Aufnahmen gefunden. Wurde eine Session gestartet?");
    }
  }

  getProperRecord(recID: string) {
    for (const rec of this.records) {
      if (rec._id === recID) {
        return rec.content;
      }
    }
  }

  submitRecords() {
    const dialogConfig = this.dialogService.defaultConfig("470px");
    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(response => {
      if (response !== null) {
        this.dataApi.setHttpHeaders(response.username, response.password);
        this.dataApi.getApiRecordID().subscribe(res => {
            const recID = res.id;
            for (const freeze of this.freezes) {
              const imageUrl = this.baseUrl + freeze.directory + "/" + freeze.filename;
              this.dataApi.getFreezeAsFile(imageUrl).subscribe(data => {
                let imageFile = new File([data], freeze.filename);
                const text = this.getProperRecord(freeze.textID);
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
    });
  }

  testApi() {
    this.dataApi.getApiRecordID().subscribe(res => {
      console.log(res.id);
    });
  }

}
