import {Component, OnInit} from "@angular/core";
import {RecordGeneratorService} from "@app/core/services/record-generator.service";
import {MatDialog} from "@angular/material/dialog";
import {RecordRequestsService} from "@app/core";
import {FreezeModel, RecordModel} from "@app/models";
import {environment} from "@env/environment.prod";

@Component({
  selector: "app-output-display",
  templateUrl: "./table-output.component.html",
  styleUrls: ["./table-output.component.scss"]
})
export class TableOutputComponent implements OnInit {

  baseUrl = environment.backend + "freezes/";

  reports: string[];
  freetext: string[];
  date: string;

  files: File[];

  freezes: FreezeModel[] = [];
  records: RecordModel[] = [];
  loaded = false;
  fetched = false;

  constructor(private recordGenerator: RecordGeneratorService,
              private dialog: MatDialog,
              private recordManager: RecordRequestsService) { }

  ngOnInit(): void {
    this.date = this.recordGenerator.date;
    this.loadFreezes();
  }

  loadFreezes() {
    if (this.recordGenerator.sessionID !== undefined) {
      this.recordManager.fetchFreezesFromFolderToBackend(this.recordGenerator.sessionID).subscribe(res => {
        console.log(res.message);
        this.fetched = true;
      },
        err => {
        console.log(err.error.message);
        this.fetched = false;
        });
    }
  }

  showImages() {
    if (this.fetched) {
      this.recordManager.getRecordsAndFreezes(this.recordGenerator.sessionID).subscribe(res => {
        this.records = res.records;
        this.freezes = this.recordGenerator.matchFreezesAndRecords(res.freezes, res.records);
        this.loaded = true;
      });
    } else {
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
    // TODO: Add modal dialog that asks for username and password
    this.recordManager.getApiRecordID().subscribe(res => {
      const recID = res.id;
      for (const freeze of this.freezes) {
        // TODO: Get freeze as File object
        const imageUrl = this.baseUrl + freeze.directory + "/" + freeze.filename;
        this.recordGenerator.getFreezeAsFile(imageUrl).subscribe(data => {
          let imageFile = new File([data], freeze.filename);
          const text = this.getProperRecord(freeze.textID);
          console.log(imageFile, text);
          this.recordManager.saveToApi(imageFile, text, recID).subscribe(res => {
            console.log("Success", res);
          });
        })
      }
    })
  }

  testGetImagesAsFiles() {
    const directory: string = "";
    const images: string[] = [] // TODO ADD IMAGE URLS
    for (const image of images) {
      const imageUrl = this.baseUrl + directory + "/" + image;
      this.recordGenerator.getFreezeAsFile(imageUrl).subscribe(data => {
        let imageFile = new File([data], image);
        console.log(imageFile);
      });
    }
  }

  testApi() {
    this.recordManager.getApiRecordID().subscribe(res => {
      console.log(res.id);
    });
  }

}
