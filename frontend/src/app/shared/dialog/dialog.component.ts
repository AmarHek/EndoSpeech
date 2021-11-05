import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: "app-upload-modal",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.css"]
})
export class DialogComponent implements OnInit {

  @ViewChild("imagefile") imagefile;
  public imagefiles: File[];
  public images: string[];

  public imgURL: string;
  public message: string;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }

  onFilesAdded(files, type: string) {
    if (type === "image") {
      this.imagefiles = files;
      this.readImages(this.imagefiles);
      this.preview(this.imagefiles);
    } /*else if (type === "text") {
      this.textfiles = files;
      this.htmlOutputService.readText(this.textfiles).then(() => {
        console.log("Text reading successful!");
      });
      this.textsUploaded = true;
    } */
  }

  close() {
    return this.dialogRef.close(null);
  }

  submit() {
    return this.dialogRef.close(this.images);
  }

  preview(files) {
    if (files.length > 0) {
      const mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Nur Bilder werden unterstützt.";
      } else {
        this.message = null;
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
          this.imgURL = reader.result as string;
        };
      }
    }
  }

  readImages(imagefiles: File[]) {
    console.log(imagefiles);
    this.images = [];
    for (const file of imagefiles) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = (_event) => {
        this.images.push(reader.result as string);
      };
    }
  }

}
