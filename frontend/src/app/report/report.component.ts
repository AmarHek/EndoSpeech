import {Component, OnInit, Input} from "@angular/core";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"]
})
export class ReportComponent implements OnInit {

  @Input() report: string;
  @Input() judgement: string;

  disclaimer: string;

  constructor() { }

  // TODO: make download button
  // TODO: Send change event to layout so changes in report are reflected in data structure

  ngOnInit() {
    this.disclaimer = "Dieser Bericht wurde mit Hilfe eines sprachgesteuerten Browsertools aus Textbausteinen erstellt.";
  }

  copyText(inputElement: HTMLTextAreaElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
  }

  copyAll() {
    let fullText: string;
    fullText = this.report + "\n\n" + this.disclaimer + "\n\n\n" + this.judgement + "\n\n" + this.disclaimer;
    const selBox = document.createElement("textarea");
    selBox.value = fullText;
    document.body.append(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
  }


}
