import { Component, OnDestroy, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { TimeStampsService } from "../../services/time-stamps.service";
import { DisplayService } from "../../services/display.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmDialogComponent, ConfirmDialogModel } from "../confirm-dialog/confirm-dialog.component";
import * as N from "../../models/model";
import { Subscription } from "rxjs";
import { DictManagerService } from "../../services/dict-manager.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";


@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit, OnDestroy {

  dicts: N.Dict[] = [];
  dictSub: Subscription;
  isLoading: boolean;
  downJson;

  ui: string;

  constructor(private http: HttpClient,
    private timesService: TimeStampsService,
    private displayService: DisplayService,
    private dialog: MatDialog,
    private dictManagerService: DictManagerService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.isLoading = false;
    this.setUi();
    this.updateList();
  }

  removeAlert(_id: string) {
    const dialogData = new ConfirmDialogModel(
      "warning",
      "Entfernen bestätigen",
      "Möchten Sie die Schablone '" + _id + "' wirklich entfernen?");

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = "400px";
    dialogConfig.data = dialogData;
    dialogConfig.position = { top: "50px" };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.remove(_id);
      }
    });
  }

  generateDownloadJson(jsonData) {
    const json = JSON.stringify(jsonData);
    this.downJson = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(json));
  }

  updateList(): void {
    this.dictManagerService.getList();
    this.dictSub = this.dictManagerService.getListUpdateListener().subscribe((list: N.Dict[]) => {
      this.dicts = list;
      this.isLoading = false;
    });
  }

  setUi() {
    this.displayService.getUi().subscribe((value) => {
      this.ui = value;
    })
  }

  ngOnDestroy(): void {
    this.dictSub.unsubscribe();
  }

  remove(id: string): void {
    this.dictManagerService.remove(id);
  }

}
