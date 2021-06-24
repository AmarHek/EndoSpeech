import {Component, DoCheck, OnInit} from "@angular/core";
import {HtmlOutputService} from "../html-output.service";
import {getBase64Image} from "../../../../helper-classes/util";

@Component({
  selector: "app-output-display",
  templateUrl: "./display.component.html",
  styleUrls: ["./display.component.css"]
})
export class DisplayComponent implements OnInit {

  imgUrls: Array<string>;
  reports: Array<string>;
  freetext: Array<string>;
  date: string;

  constructor(private htmlOutputService: HtmlOutputService) { }

  ngOnInit(): void {
    this.imgUrls = this.htmlOutputService.images;
    this.reports = this.htmlOutputService.reports;
    this.date = this.htmlOutputService.date;
    this.freetext = this.htmlOutputService.texts;
    /*
    if (this.reports.length === 0) {
      this.loadFromLocalStorage();
    }*/

    this.alignArrays();
  }

  /*ngDoCheck(): void {
    this.saveImagesToStorage();
    localStorage.setItem("freetext", JSON.stringify(this.freetext));
    localStorage.setItem("reports", JSON.stringify(this.reports));
    localStorage.setItem("date", this.date);
  }*/

  loadFromLocalStorage() {
    this.imgUrls = JSON.parse(localStorage.getItem("images"));
    this.freetext = JSON.parse(localStorage.getItem("texts"));
    this.reports = JSON.parse(localStorage.getItem("reports"));
    this.date = localStorage.getItem("date");
  }

  saveImagesToStorage() {
    const result: string[] = []
    for (const img of this.imgUrls) {
      result.push(getBase64Image(img));
    }
    localStorage.setItem("images", JSON.stringify(result));
  }

  alignArrays() {
    if (this.reports.length > this.imgUrls.length) {
      const diff = this.reports.length - this.imgUrls.length;
      for (let i = 0; i < diff; i++) {
        this.imgUrls.push(null);
      }
    } else if (this.imgUrls.length > this.reports.length) {
      const diff = this.imgUrls.length - this.reports.length;
      for (let i = 0; i < diff; i++) {
        this.reports.push("Kein Bericht vorhanden");
        this.freetext.push("Kein Text vorhanden");
      }
    }
  }

}
