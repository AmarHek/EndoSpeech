import {Component, DoCheck, OnInit} from "@angular/core";
import {TableOutputService} from "../table-output.service";
import {getBase64Image} from "../../../helper-classes/util";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Component({
  selector: "app-output-display",
  templateUrl: "./table-output.component.html",
  styleUrls: ["./table-output.component.scss"]
})
export class TableOutputComponent implements OnInit {

  imgUrls: string[];
  reports: string[];
  freetext: string[];
  date: string;
  timestamps: string[];

  constructor(private tableOutputService: TableOutputService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.imgUrls = [];
    this.date = this.tableOutputService.date;
    this.freetext = this.tableOutputService.getFreetext();
    this.timestamps = this.tableOutputService.getTimestamps();

    this.reports = this.tableOutputService.getReports();

    console.log(this.date, this.freetext, this.timestamps, this.reports);
    this.alignArrays();
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

    for (let i=0; i<this.reports.length; i++) {
      if (this.reports[i] === undefined) {
        this.reports[i] = "Kein Bericht vorhanden";
      }
    }
  }

  loadImages() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      console.log("Hat geklappt?");
        if (result !== null) {
          this.imgUrls = result;
        }
      });

    }
}
