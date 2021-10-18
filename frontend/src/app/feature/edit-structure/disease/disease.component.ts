import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseComponent implements OnInit {
  @Input()
  disTyp: string;
  constructor() { }

  ngOnInit(): void {
  }

}
