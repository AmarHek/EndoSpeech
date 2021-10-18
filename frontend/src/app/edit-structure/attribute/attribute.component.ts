import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {

  @Input() mode: string;

  @Input() myAttAnzVar: any = 0;
  @Output() myAttAnzVarChange = new EventEmitter();

  @Input() textID: string;
  @Input() nameID: string;
  @Input() judID: string;
  @Input() normalID: any;
  @Input() anzvarID: string;
  @Input() zugroupID: string;
  @Input() augroupID: string;


  constructor() { }

  ngOnInit(): void {
  }

  changeAnzVar() {
    this.myAttAnzVarChange.emit(this.myAttAnzVar);
  }

}
