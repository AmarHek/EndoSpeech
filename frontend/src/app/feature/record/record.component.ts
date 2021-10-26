import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";

import {getDateFormatted} from "@app/helpers/util";
import {RecordModel} from "@app/models/recordModel";
import {RecordRequestsService} from "@app/core/services/record-requests.service";
import {nanoid} from "nanoid";
import {TableOutputService} from "@app/core/services/table-output.service";

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
  records: RecordModel[] = [];
  recording = false;

  toReplace: RegExp[];
  sessionID: string;

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
    }
  }

  @HostListener("window:beforeunload")
  saveSession() {
    if (this.sessionID !== undefined) {
      localStorage.setItem(SESSION_ID_STORAGE, this.sessionID);
    }
  }

  constructor(private recordManager: RecordRequestsService,
              private tableOutputService: TableOutputService) { }

  ngOnInit(): void {
    this.toReplace = [
      new RegExp("[Ss]peichern")];
    this.records = this.tableOutputService.records;
  }

  ngOnDestroy() {
    if (this.sessionID !== undefined) {
      localStorage.setItem(SESSION_ID_STORAGE, this.sessionID);
    }
  }

  initSession(): void {
    this.sessionID = nanoid();
    this.records = [];
    this.tableOutputService.reset();
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
    if (this.sessionID === undefined) {
      this.sessionID = nanoid();
    }
    const newRec: RecordModel = {
      sessionID: this.sessionID,
      content: this.recordedText,
      timestamp: new Date()
    };
    this.records.push(newRec);
    this.recordManager.addRecord(newRec);
    this.recordedText = "";
  }

  formatDate(date: Date) {
    return getDateFormatted(date, true);
  }

  fetchRecords() {
    let res = true;
    if (this.records.length > 0) {
      res = window.confirm("Warnung: Aktuell bestehende Aufnahmen werden beim Laden überschrieben.");
    }
    if (res === true) {
      if (this.sessionID === undefined) {
        const idTemp = localStorage.getItem(SESSION_ID_STORAGE);
        this.recordManager.getRecordsBySessionID(idTemp).subscribe((res) => {
          this.records = res.records;
          this.tableOutputService.records = res.records;
          if (res.records.length > 0) {
            this.sessionID = idTemp;
          }
        });
      } else {
        window.alert("Neue Untersuchung hat bereits angefangen.");
      }
    }
  }

}
