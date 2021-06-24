import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { TimeStampsService } from '../../services/time-stamps.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { DictManagerService } from '../../services/dict-manager.service';
import {DisplayService} from '../../services/display.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  name = '';
  months: string[] = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  mode: string;

  form: FormGroup;

  constructor(private http: HttpClient, private router: Router,
              private timesService: TimeStampsService,
              private dictManager: DictManagerService,
              private displayService: DisplayService) { }

  ngOnInit() {
    this.setMode();
    this.initForm();
  }

  // TODO: fix Formgroup

  private setMode() {
    this.displayService.getMode().subscribe((value) => {
      this.mode = value;
    });
  }

  private initForm() {
    this.form = new FormGroup({
      'name': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'image': new FormControl(null, {validators: [Validators.required]})
    });
  }

  uploadNew() {
    const file = (document.getElementById('uploadFile') as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    const postData = new FormData();
    postData.append('file', this.form.value.image, this.form.value.name);
    console.log(this.form.value.name);
    console.log(this.form.value.image);
    console.log(postData);
    this.dictManager.addExcel(postData);
  }

  upload(): void {
    this.timesService.addTimeStamp(new Date());
    const reader = new FileReader();
    reader.readAsDataURL((document.getElementById('uploadFile') as HTMLInputElement).files[0]);
    reader.onload = () => {
      const dat = new Date();
      const base64 = (reader.result as string).replace(/^.*?base64,/, '');
      const data = { name: this.name + ' ' + dat.getDate() + ' ' + this.months[dat.getMonth()] + ' ' + dat.getFullYear() , data: base64 };
      this.http.post(environment.urlRootRadio + 'upload', data, { 'observe': 'response' } ).subscribe((result) => {
        window.alert('Upload Erfolgreich');
        this.router.navigate(['list']);

      }, (error) => {
        if (error instanceof ErrorEvent) {
          window.alert('an unknown error has occurred');
        } else {
          window.alert('parsing failure: ' + (error as any).error);
        }
      });
    };
    reader.onerror = (error) => {
      window.alert('The following error occurred:\n' + error);
    };
  }

}
