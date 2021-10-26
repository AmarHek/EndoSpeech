import {Component, OnInit} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { Router } from "@angular/router";
import { TimeStampsService } from "@app/core/services/time-stamps.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { DictRequestsService } from "@app/core/services/dict-requests.service";
import {DisplayService} from "@app/core/services/display.service";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"]
})
export class UploadComponent implements OnInit {
  name = "";
  months: string[] = ["Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"];
  mode: string;

  form: FormGroup;

  constructor(private http: HttpClient, private router: Router,
              private timesService: TimeStampsService,
              private dictManager: DictRequestsService,
              private displayService: DisplayService) { }

  ngOnInit() {
    this.initForm();
  }

  // TODO: fix Formgroup

  private initForm() {
    this.form = new FormGroup({
      "name": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      "image": new FormControl(null, {validators: [Validators.required]})
    });
  }

  upload() {
    const file = (document.getElementById("uploadFile") as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get("image").updateValueAndValidity();

    const postData = new FormData();
    postData.append("file", this.form.value.image, this.form.value.name);
    console.log(this.form.value.name);
    console.log(this.form.value.image);
    console.log(postData);
    this.dictManager.addExcel(postData);
  }

}
