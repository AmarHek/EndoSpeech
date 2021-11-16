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

  @HostListener("window:beforeunload")
  saveSession() {
    // if recordings have been made, save session ID to localstorage before unloading
    if (this.recordManager.sessionID !== undefined && this.recordManager.records.length > 0) {
      localStorage.setItem(SESSION_ID_STORAGE, this.recordManager.sessionID);
    }
  }

  constructor(private recordApi: RecordFreezeApiService,
              private recordManager: RecordFreezeManager,
              private dialogService: MatDialogService,
              private dialog: MatDialog) { }

  get sessionID() {
    return this.recordManager.sessionID;
  }

  get records() {
    return this.recordManager.records;
  }

  ngOnInit(): void {
    // initiate strings that need to be removed before saving a recording
    this.toReplace = [
      new RegExp("[Ss]peichern")];
  }

  ngAfterViewInit(): void {
    this.inputField.nativeElement.focus();
  }

  ngOnDestroy() {
    // if recordings have been made, save session ID to localstorage before destroying this component
    if (this.recordManager.sessionID !== undefined && this.recordManager.records.length > 0) {
      localStorage.setItem(SESSION_ID_STORAGE, this.recordManager.sessionID);
    }
  }

  initSession(): void {
    let res = true;
    if (this.recordManager.records.length > 0) {
      res = window.confirm("Warnung: Aktuell bestehende Aufnahmen werden überschrieben.");
    }
    if (res === true) {
      this.recordManager.init();
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
    if (this.recordManager.sessionID === undefined) {
      this.recordManager.sessionID = nanoid();
    }
    const newRec: Record = {
      sessionID: this.recordManager.sessionID,
      content: this.recordedText,
      timestamp: Math.round(+new Date()/1000) // UNIX timestamp
    };
    this.recordApi.addRecord(newRec).subscribe((res) => {
      newRec._id = res.recordID;
      this.recordManager.records.push(newRec);
    });
    this.recordedText = "";
  }

  formatDate(unixTime: number) {
    return getDateFormatted(new Date(unixTime * 1000), true);
  }

  fetchRecords() {
    let res = true;
    if (this.recordManager.records.length > 0) {
      res = window.confirm("Warnung: Aktuell bestehende Aufnahmen werden beim Laden überschrieben.");
    }
    if (res === true) {
        const idTemp = localStorage.getItem(SESSION_ID_STORAGE);
        this.recordApi.getRecordsBySessionID(idTemp).subscribe((res) => {
          this.recordManager.records = res.records;
          if (res.records.length > 0) {
            this.recordManager.sessionID = idTemp;
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
        this.recordApi.updateRecord(record._id, newContent).subscribe(res => {
          console.log(res.message);
          record.content = newContent;
        });
      }
    });
  }

  deleteRecord(record: Record) {
    this.recordApi.deleteRecord(record._id).subscribe(res => {
      console.log(res.message);
      const index = this.recordManager.records.indexOf(record);
      // remove element from list
      if (index > -1) {
        this.recordManager.records.splice(index, 1);
      }
    }, err => {
      console.log(err);
    });
  }

}
