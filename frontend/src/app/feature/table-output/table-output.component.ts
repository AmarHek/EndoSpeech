import {Component, OnInit} from "@angular/core";
import {TableOutputService} from "@app/core/services/table-output.service";
import {DialogComponent} from "@app/shared/dialog/dialog.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {RecordRequestsService} from "@app/core";
import {FreezeModel, RecordModel} from "@app/models";
import {environment} from "@env/environment.prod";

@Component({
  selector: "app-output-display",
  templateUrl: "./table-output.component.html",
  styleUrls: ["./table-output.component.scss"]
})
export class TableOutputComponent implements OnInit {

  baseUrl = environment.backend + "freezes/";

  reports: string[];
  freetext: string[];
  date: string;

  files: File[];

  freezes: FreezeModel[] = [];
  records: RecordModel[] = [];

  constructor(private tableOutputService: TableOutputService,
              private dialog: MatDialog,
              private recordManager: RecordRequestsService) { }

  ngOnInit(): void {
    this.date = this.tableOutputService.date;
  }

  getImages() {
    if (this.tableOutputService.sessionID !== undefined) {
      this.recordManager.getRecordsAndFreezes(this.tableOutputService.sessionID).subscribe(res => {
        this.records = res.records;
        this.freezes = this.tableOutputService.matchFreezesAndRecords(res.freezes, res.records);
        window.alert("Freezes können jetzt angezeigt werden.");
      },
        err => {
        window.alert(err.error.message);
        });
    } else {
      window.alert("Keine Session gestartet!");
    }
  }

  getAll() {
    this.recordManager.onlyGetRecordsAndFreezes(this.tableOutputService.sessionID).subscribe(res => {
      this.records = res.records;
      this.freezes = this.tableOutputService.matchFreezesAndRecords(res.freezes, res.records);
    },
      err => {
      window.alert(err.error.message);
      });
  }

  getProperRecord(recID: string) {
    for (const rec of this.records) {
      if (rec._id === recID) {
        return rec.content;
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
        if (result !== null) {
          this.files = result;
        }
      });
    }


}
