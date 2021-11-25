import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";

import {getDateFormatted} from "@app/helpers/util";
import {Record} from "@app/models/record";
import {RecordFreezeApiService} from "@app/core/services/record-freeze-api.service";
import {nanoid} from "nanoid";
import {RecordFreezeManager} from "@app/core/services/record-freeze-manager.service";
import {MatDialogService} from "@app/core";
import {MatDialog} from "@angular/material/dialog";
import {EditRecordDialogComponent} from "@app/shared";

const SESSION_ID_STORAGE = "sessionID";

@Component({
  selector: "app-record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.scss"]
})

export class RecordComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('inputField') inputField: ElementRef;

  recordedText = "";

  toReplace: RegExp[];

  finishKeyword = "speichern";

  active = true;

  @HostListener("window:beforeunload")
  saveSession() {
    // if recordings have been made, save session ID to localstorage before unloading
    if (this.dataManager.sessionID !== undefined && this.dataManager.records.length > 0) {
      localStorage.setItem(SESSION_ID_STORAGE, this.dataManager.sessionID);
    }
  }

  constructor(private dataApi: RecordFreezeApiService,
              private dataManager: RecordFreezeManager,
              private dialogService: MatDialogService,
              private dialog: MatDialog) { }

  get sessionID() {
    return this.dataManager.sessionID;
  }

  get records() {
    return this.dataManager.records;
  }

  ngOnInit(): void {
    // initiate strings that need to be removed before saving a recording
    this.addWindowListeners();
    this.toReplace = [
      new RegExp("[Ss]peichern")];
  }

  ngAfterViewInit(): void {
    this.inputField.nativeElement.focus();
  }

  ngOnDestroy() {
    // if recordings have been made, save session ID to localstorage before destroying this component
    if (this.dataManager.sessionID !== undefined && this.dataManager.records.length > 0) {
      localStorage.setItem(SESSION_ID_STORAGE, this.dataManager.sessionID);
    }
  }

  private addWindowListeners() {
    const parent = this;
    window.addEventListener('focus', function (event) {
      parent.active = true;
    });
    window.addEventListener('blur', function (event) {
      parent.active = false;
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

  onInput() {
    if (this.recordedText.toLowerCase().includes(this.finishKeyword)) {
      this.cleanseRecording();
      this.generateRecording();
    }
  }

  onBlur(event) {
    this.inputField.nativeElement.focus();
  }

  cleanseRecording() {
    for (const repl of this.toReplace) {
      this.recordedText = this.recordedText.replace(repl, "");
    }
  }

  generateRecording() {
    if (this.dataManager.sessionID === undefined) {
      this.dataManager.sessionID = nanoid();
    }
    const newRec: Record = {
      sessionID: this.dataManager.sessionID,
      content: this.recordedText,
      timestamp: Math.round(+new Date()/1000) // UNIX timestamp
    };
    this.dataApi.addRecord(newRec).subscribe((res) => {
      newRec._id = res.recordID;
      this.dataManager.records.push(newRec);
    });
    this.dataManager.fetched = false;
    this.dataManager.loaded = false;
    setTimeout(() => this.recordedText = "", 50);
  }

  formatDate(unixTime: number) {
    return getDateFormatted(new Date(unixTime * 1000), true);
  }

  loadRecords() {
    let res = true;
    if (this.dataManager.records.length > 0) {
      res = window.confirm("Warnung: Aktuell bestehende Aufnahmen werden beim Laden überschrieben.");
    }
    if (res === true) {
        const idTemp = localStorage.getItem(SESSION_ID_STORAGE);
        this.dataApi.getRecordsBySessionID(idTemp).subscribe((res) => {
          this.dataManager.records = res.records;
          if (res.records.length > 0) {
            this.dataManager.sessionID = idTemp;
          }
        });
      }
  }

  editRecord(record: Record) {
    this.inputField.nativeElement.disabled = true;
    const dialogConfig = this.dialogService.defaultConfig();
    dialogConfig.minWidth = "500px";
    dialogConfig.data = {
      content: record.content
    };
    const dialogRef = this.dialog.open(EditRecordDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(newContent => {
      this.inputField.nativeElement.disabled = false;
      this.inputField.nativeElement.focus();
      if (newContent !== null) {
        this.dataApi.updateRecord(record._id, newContent).subscribe(res => {
          console.log(res.message);
          record.content = newContent;
        });
      }
    });
  }

  deleteRecord(record: Record) {
    this.dataApi.deleteRecord(record._id).subscribe(res => {
      console.log(res.message);
      const index = this.dataManager.records.indexOf(record);
      // remove element from list
      if (index > -1) {
        this.dataManager.records.splice(index, 1);
      }
    }, err => {
      console.log(err);
    });
  }

}
