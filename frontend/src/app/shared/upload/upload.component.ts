import {Component, OnInit} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {DictRequestsService} from "@app/core";
import {getFileExtension} from "@app/helpers";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"]
})
export class UploadComponent implements OnInit {
  currentFile: File;
  showWarning = false;
  uploadForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<UploadComponent>,
              private dictManager: DictRequestsService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.uploadForm = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      file: new FormControl(null, {validators: [Validators.required]}),
      filename: new FormControl(null, {validators: [Validators.required]})
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.currentFile = event.target.files[0];
      this.checkFileExtension(this.currentFile);
      this.uploadForm.get("file").setValue(this.currentFile);
    }
  }

  checkFileExtension(file: File) {
    this.showWarning = false;
    const extension = getFileExtension(file.name);
    if (!(extension === "xlsx" || extension === "json")) {
      this.showWarning = true;
    }
  }

  upload() {
    const extension = getFileExtension(this.uploadForm.value.file.name);
    const postData = new FormData();
    postData.append("name", this.uploadForm.value.name);
    postData.append("file", this.uploadForm.value.file);
    if (extension === "xlsx") {
      // this.templateManager.addExcel(postData);
    } else if (extension === "json") {
      this.dictManager.addDictFromJSON(postData).subscribe((res) => {
        window.alert(res.message);
        this.uploadForm.reset();
        this.currentFile = null;
        this.close();
      });
    } else {
      window.alert("Nicht unterstützter Dateityp! Datei muss .xlsx oder .json sein.");
      this.uploadForm.reset();
      this.currentFile = null;
      this.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
