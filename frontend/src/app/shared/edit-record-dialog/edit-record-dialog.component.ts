import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-record-dialog',
  templateUrl: './edit-record-dialog.component.html',
  styleUrls: ['./edit-record-dialog.component.css']
})
export class EditRecordDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EditRecordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  content: string;

  ngOnInit(): void {
    this.content = this.data.content;
  }

  close() {
    this.dialogRef.close(null);
  }

  submit() {
    this.dialogRef.close(this.content);
  }

}
