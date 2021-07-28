import { Component, OnInit } from "@angular/core";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogComponent} from "../output/dialog/dialog.component";
import {getDateFormatted, InputDiff} from "../../helper-classes/util";
import {Recording} from "../../helper-classes/recording"
import {RecordManagerService} from "../services/record-manager.service";

type States = "An" | "Aus" | "Pause";

@Component({
  selector: "app-record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.scss"]
})

export class RecordComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private recordManager: RecordManagerService) { }

  recordedText = "";
  inputText = "";
  oldInput = "";
  files: Recording[] = [];
  state: States = "Aus";

  toReplace: RegExp[];


  ngOnInit(): void {
    this.toReplace = [new RegExp("[Aa]ufnahme [Ss]tart"),
      new RegExp("[Aa]ufnahme [Pp]ause"),
      new RegExp("[Aa]ufnahme [Ss]top"),
      new RegExp("[Aa]ufnahme [Ww]eiter")];
  }

  onInput(event) {
    console.log(event);
    const diff = this.getInputDiff();

    if (this.state === "An") {
      this.applyDiff(diff);

      if (this.inputText.toLowerCase().includes("aufnahme stop")) {
        this.cleanseRecording();
        this.generateRecording();
        this.changeState("Aus");

      } else if (this.inputText.toLowerCase().includes("aufnahme pause")) {
        this.cleanseRecording();
        this.changeState("Pause");
      }

    } else if (this.state === "Aus") {
      if (this.inputText.toLowerCase().includes("aufnahme start")) {
        this.changeState("An");
      }

    } else if (this.state === "Pause") {
      if (this.inputText.toLowerCase().includes("aufnahme weiter")) {
        this.changeState("An");

      } else if (this.inputText.toLowerCase().includes("aufnahme stop")) {
        this.cleanseRecording();
        this.generateRecording();
        this.changeState("Aus");
      }
    }

    if (this.inputText.length > 500) {
      this.inputText = "";
    }
    this.oldInput = this.inputText;
  }

  changeState(newState: States) {
    this.inputText = "";
    this.oldInput = "";
    this.state = newState;
  }

  cleanseRecording() {
    for (const repl of this.toReplace) {
      this.recordedText = this.recordedText.replace(repl, "");
    }
  }

  generateRecording() {
    const newRec: Recording = {
      content: this.recordedText,
      timestamp: new Date()
    };
    this.files.push(newRec);
    this.recordManager.addRecord(newRec);
    this.recordedText = "";
  }

  getInputDiff(): InputDiff {
    if (this.inputText.length > this.oldInput.length) {
      const diff = this.inputText.replace(this.oldInput, "");
      return {
        diff: diff,
        toDelete: 0
      };
    } else {
      const toDelete = this.inputText.length - this.oldInput.length;
      return {
        diff: "",
        toDelete: toDelete
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

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.data = {
      files: this.files
    };

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);
  }

  formatDate(date: Date) {
    return getDateFormatted(date, true);
  }

  fetchRecords() {
    this.recordManager.getRecords();
  }

}