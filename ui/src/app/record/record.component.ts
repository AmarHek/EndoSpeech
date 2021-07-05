import { Component, OnInit } from "@angular/core";
import { Recording } from "../../helper-classes/recording";

@Component({
  selector: "app-record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.scss"]
})

export class RecordComponent implements OnInit {

  constructor() { }

  recordedText = "";
  inputText = "";
  files: Recording[];


  ngOnInit(): void {
  }

  onInput(event) {
    console.log(event);
    console.log(this.inputText);
  }

}
