import { Component, OnDestroy, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { TimeStampsService } from "../../services/time-stamps.service";
import { DisplayService } from "../../services/display.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmDialogComponent, ConfirmDialogModel } from "../confirm-dialog/confirm-dialog.component";
import * as N from "../../../helper-classes/model";
import { Subscription } from "rxjs";
import { DictManagerService } from "../../services/dict-manager.service";


@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit, OnDestroy {

  dicts: N.Dict[] = [];
  dictSub: Subscription;
  isLoading: boolean;

  ui: string;

  constructor(private http: HttpClient,
    private timesService: TimeStampsService,
    private displayService: DisplayService,
    private dialog: MatDialog,
    private dictManagerService: DictManagerService) { }

  ngOnInit() {
    this.isLoading = false;
    this.setUi();
    this.updateList();
  }

  removeAlert(genOrId: string) {
    const dialogData = new ConfirmDialogModel(
      "warning",
      "Entfernen bestätigen",
      "Möchten Sie die Schablone '" + genOrId + "' wirklich entfernen?");

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = "400px";
    dialogConfig.data = dialogData;
    dialogConfig.position = { top: "50px" };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.remove(genOrId);
      }
    });
  }

  updateList(): void {
    this.dictManagerService.getList();
    this.dictSub = this.dictManagerService.getListUpdateListener().subscribe((list: N.Dict[]) => {
      this.dicts = list;
      this.isLoading = false;
      console.log("onInit");
      console.log(this.dicts);
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
