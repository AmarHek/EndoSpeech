import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";

import {getDateFormatted} from "@app/helpers/util";
import {Record} from "@app/models/record";
import {RecordRequestsService} from "@app/core/services/record-requests.service";
import {nanoid} from "nanoid";
import {RecordGeneratorService} from "@app/core/services/record-generator.service";
import {MatDialogService} from "@app/core";
import {MatDialog} from "@angular/material/dialog";
import {EditRecordDialogComponent} from "@app/shared";

const SESSION_ID_STORAGE = "sessionID";

const RECORDING_KEY = "F4";

@Component({
  selector: "app-record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.scss"]
})

export class RecordComponent implements OnInit, OnDestroy {

  @ViewChild('inputField') inputField: ElementRef;

  recordedText = "";
  records: Record[] = [];
  recording = false;

  toReplace: RegExp[];

  finishKeyword = "speichern";

  @HostListener("window:keydown", ["$event"])
  keyDownEvent(event: KeyboardEvent) {
    if (event.key === RECORDING_KEY) {
      this.recording = true;
      this.inputField.nativeElement.focus();
    }
  }

  @HostListener("window:keyup", ["$event"])
  keyUpEvent(event: KeyboardEvent) {
    if (event.key === RECORDING_KEY) {
      this.recording = false;
      this.inputField.nativeElement.blur();
    }
  }

  @HostListener("window:beforeunload")
  saveSession() {
    // if recordings have been made, save session ID to localstorage before unloading
    if (this.recordGenerator.sessionID !== undefined && this.records.length > 0) {
      localStorage.setItem(SESSION_ID_STORAGE, this.recordGenerator.sessionID);
    }
  }

  constructor(private recordCaller: RecordRequestsService,
              private recordGenerator: RecordGeneratorService,
              private dialogService: MatDialogService,
              private dialog: MatDialog) { }

  get sessionID() {
    return this.recordGenerator.sessionID;
  }

  ngOnInit(): void {
    // initiate strings that need to be removed before saving a recording
    this.toReplace = [
      new RegExp("[Ss]peichern")];
    // get records from recordGenerator (for component switching)
    this.records = this.recordGenerator.records;
  }


  ngOnDestroy() {
    // if recordings have been made, save session ID to localstorage before destroying this component
    if (this.recordGenerator.sessionID !== undefined && this.records.length > 0) {
      localStorage.setItem(SESSION_ID_STORAGE, this.recordGenerator.sessionID);
    }
  }

  initSession(): void {
    this.recordGenerator.sessionID = nanoid();
    this.records = [];
    this.recordGenerator.reset();
  }

  onInput() {
    if (this.recording) {
      if (this.recordedText.toLowerCase().includes(this.finishKeyword)) {
        this.cleanseRecording();
        this.generateRecording();
      }
    }
  }

  cleanseRecording() {
    for (const repl of this.toReplace) {
      this.recordedText = this.recordedText.replace(repl, "");
    }
  }

  generateRecording() {
    if (this.recordGenerator.sessionID === undefined) {
      this.recordGenerator.sessionID = nanoid();
    }
    const newRec: Record = {
      sessionID: this.recordGenerator.sessionID,
      content: this.recordedText,
      timestamp: Math.round(+new Date()/1000) // UNIX timestamp
    };
    this.recordCaller.addRecord(newRec).subscribe((res) => {
      newRec._id = res.recordID;
      this.records.push(newRec);
    });
    this.recordedText = "";
  }

  formatDate(unixTime: number) {
    return getDateFormatted(new Date(unixTime * 1000), true);
  }

  fetchRecords() {
    let res = true;
    if (this.records.length > 0) {
      res = window.confirm("Warnung: Aktuell bestehende Aufnahmen werden beim Laden überschrieben.");
    }
    if (res === true) {
        const idTemp = localStorage.getItem(SESSION_ID_STORAGE);
        this.recordCaller.getRecordsBySessionID(idTemp).subscribe((res) => {
          this.records = res.records;
          this.recordGenerator.records = res.records;
          if (res.records.length > 0) {
            this.recordGenerator.sessionID = idTemp;
          }
        });
      }
  }

  editRecord(record: Record) {
    const dialogConfig = this.dialogService.defaultConfig();
    dialogConfig.data = {
      content: record.content
    };
    const dialogRef = this.dialog.open(EditRecordDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(newContent => {
      if (newContent !== null) {
        this.recordCaller.updateRecord(record._id, newContent).subscribe(res => {
          console.log(res.message);
          record.content = newContent;
        });
      }
    });
  }

  deleteRecord(record: Record) {
    this.recordCaller.deleteRecord(record._id).subscribe(res => {
      console.log(res.message);
      const index = this.recordGenerator.records.indexOf(record);
      // remove element from list
      if (index > -1) {
        this.recordGenerator.records.splice(index, 1);
      }
    }, err => {
      console.log(err);
    });
  }

}
