import { Component, OnInit } from "@angular/core";

import {getDateFormatted, InputDiff} from "../../helpers/util";
import {Record} from "../../models/record";
import {RecordManagerService} from "../../services/record-manager.service";
import {nanoid} from "nanoid";
import {TableOutputService} from "../table-output.service";

type RecordState = "An" | "Aus" | "Pause";
type SessionState = "Aktiv" | "Inaktiv";

interface RecordKeywords {
  sessionStart:   string;
  recordStart:    string;
  recordPause:    string;
  recordCont:     string;
  recordFinish:   string;
  sessionFinish:  string;
}

const RECORD_KEYWORDS_STORAGE = "recordKeywords";
const SESSION_ID_STORAGE = "sessionID";

@Component({
  selector: "app-record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.scss"]
})

export class RecordComponent implements OnInit {

  recordedText = "";
  inputText = "";
  oldInput = "";

  // TODO: Make these records from observable and only add to table-output-service
  records: Record[] = [];

  // TODO: Possible the same for sessionState (but not recordingState)
  sessionState: SessionState = "Inaktiv";
  recordState: RecordState = "Aus";

  toReplace: RegExp[];
  // TODO: Delegate keyword-management to a service
  recordKeywords: RecordKeywords;
  defaultKeywords: RecordKeywords;
  sessionID: string;

  constructor(private recordManager: RecordManagerService,
              private tableOutputService: TableOutputService) { }

  ngOnInit(): void {
    this.initDefaultKeywords();
    this.initRecordKeywords();
    // TODO: Dynamisch machen
    this.toReplace = [
      new RegExp("[Uu]ntersuchung [Ss]tart"),
      new RegExp("[Aa]ufnahme [Ss]tart"),
      new RegExp("[Aa]ufnahme [Pp]ause"),
      new RegExp("[Aa]ufnahme [Ss]top"),
      new RegExp("[Aa]ufnahme [Ww]eiter"),
      new RegExp("[Uu]ntersuchung [Ss]top")];

    this.records = this.tableOutputService.records;
    if (this.records.length > 0) {
      this.sessionState = "Aktiv";
    }
  }

  initDefaultKeywords(): void {
    this.defaultKeywords = {
      sessionStart: "untersuchung start",
      recordStart: "aufnahme start",
      recordPause: "aufnahme pause",
      recordCont: "aufnahme weiter",
      recordFinish: "aufnahme stop",
      sessionFinish: "untersuchung stop"
    };
  }

  initRecordKeywords(): void {
    const savedKeywords = localStorage.getItem(RECORD_KEYWORDS_STORAGE);
    if (savedKeywords !== null) {
      this.recordKeywords = JSON.parse(savedKeywords);
    } else {
      this.recordKeywords = this.defaultKeywords;
    }
  }

  initSession(): void {
    this.sessionID = nanoid();
    localStorage.setItem(SESSION_ID_STORAGE, this.sessionID);
    this.records = [];
    this.tableOutputService.reset();
    this.sessionState = "Aktiv";
  }

  resetSession(): void {
    this.initSession();
    this.sessionState = "Inaktiv";
  }

  finishSession(): void {
    this.cleanseRecording();
    // TODO: Check this for errors
    this.generateRecording();
    this.sessionState = "Inaktiv";
  }

  onInput(event) {
    const diff = this.getInputDiff();

    if (this.sessionState === "Aktiv") {

      if (this.inputText.toLowerCase().includes(this.recordKeywords.sessionFinish)) {
        this.finishSession();
      }

      if (this.recordState === "An") {
        this.applyDiff(diff);

        if (this.inputText.toLowerCase().includes(this.recordKeywords.recordFinish)) {
          this.cleanseRecording();
          this.generateRecording();
          this.changeState("Aus");

        } else if (this.inputText.toLowerCase().includes(this.recordKeywords.recordPause)) {
          this.cleanseRecording();
          this.changeState("Pause");
        }

      } else if (this.recordState === "Aus") {
        if (this.inputText.toLowerCase().includes(this.recordKeywords.recordStart)) {
          this.changeState("An");
        }

      } else if (this.recordState === "Pause") {
        if (this.inputText.toLowerCase().includes(this.recordKeywords.recordCont)) {
          this.changeState("An");

        } else if (this.inputText.toLowerCase().includes(this.recordKeywords.recordFinish)) {
          this.cleanseRecording();
          this.generateRecording();
          this.changeState("Aus");
        }
      }
    } else {
      if (this.inputText.toLowerCase().includes(this.recordKeywords.sessionStart)) {
        this.initSession();
        this.cleanseRecording();
      }
    }

    if (this.inputText.length > 500) {
      this.inputText = "";
    }
    this.oldInput = this.inputText;
  }

  changeState(newState: RecordState) {
    this.inputText = "";
    this.oldInput = "";
    this.recordState = newState;
  }

  cleanseRecording() {
    for (const repl of this.toReplace) {
      this.recordedText = this.recordedText.replace(repl, "");
    }
  }

  generateRecording() {
    const newRec: Record = {
      sessionID: this.sessionID,
      content: this.recordedText,
      timestamp: new Date()
    };
    this.records.push(newRec);
    this.recordManager.addRecord(newRec);
    this.tableOutputService.records.push(newRec);
    this.recordedText = "";
  }

  getInputDiff(): InputDiff {
    if (this.inputText.length > this.oldInput.length) {
      const diff = this.inputText.replace(this.oldInput, "");
      return {
        diff,
        toDelete: 0
      };
    } else {
      const toDelete = this.inputText.length - this.oldInput.length;
      return {
        diff: "",
        toDelete
      };
    }
  }

  applyDiff(inputDiff: InputDiff) {
    if (inputDiff.diff.length > 0) {
      this.recordedText += inputDiff.diff;
    } else {
      this.recordedText = this.recordedText.slice(0, inputDiff.toDelete);
    }
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
        this.recordManager.getRecords(idTemp).subscribe((records) => {
          console.log(records);
          this.records = records;
          this.tableOutputService.records = records;
          if (records.length > 0) {
            this.sessionID = idTemp;
          }
        });
      } else {
        window.alert("Neue Untersuchung hat bereits angefangen.");
      }
    }
  }

}
