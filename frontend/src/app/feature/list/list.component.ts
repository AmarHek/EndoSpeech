import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DisplayService } from "@app/core/services/display.service";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent, ConfirmDialogModel } from "../../shared/confirm-dialog/confirm-dialog.component";
import * as N from "@app/models/dictModel";
import { Subscription } from "rxjs";
import { DictRequestsService } from "@app/core/services/dict-requests.service";
import { DomSanitizer } from "@angular/platform-browser";
import {MatDialogService} from "@app/core";
import {UploadComponent} from "@app/shared";


@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {

  dicts: N.Dict[] = [];
  dictSub: Subscription;
  isLoading: boolean;

  ui: string;

  constructor(private http: HttpClient,
    private displayService: DisplayService,
    private dialog: MatDialog,
    private dialogService: MatDialogService,
    private dictRequestService: DictRequestsService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.isLoading = true;
    this.setUi();
    this.update();
  }

  update(): void {
    this.dictRequestService.getList().subscribe((dicts) => {
      this.dicts = dicts;
      this.isLoading = false;
    })
  }

  removeAlert(id: string) {
    const dialogData = new ConfirmDialogModel(
      "warning",
      "Entfernen bestätigen",
      "Möchten Sie die Schablone '" + id + "' wirklich entfernen?");

    const dialogConfig = this.dialogService.defaultConfig("400px", dialogData);
    dialogConfig.position = { top: "50px" };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.remove(id);
      }
    });
  }

  remove(id: string): void {
    this.dictRequestService.deleteDict(id).subscribe(() => {
      this.update()
    });
  }

  displayDate(date: string | Date): string {
    if (typeof(date) === "string") {
      date = new Date(date);
    }
    return date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
  }

  /*
  generateDownloadJson(jsonData) {
    const json = JSON.stringify(jsonData);
    this.downJson = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(json));
  } */

  setUi() {
    this.displayService.getUi().subscribe((value) => {
      this.ui = value;
    })
  }

  openUploadDialog() {
    const dialogConfig = this.dialogService.defaultConfig("470px");
    const dialogRef = this.dialog.open(UploadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.update();
    });
  }

}
