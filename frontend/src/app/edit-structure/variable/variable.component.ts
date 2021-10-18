import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.css']
})
export class VariableComponent implements OnInit {
  @Input() myAttKind: string;
  @Input() kindID: string;
  @Input() tbID: string;
  @Input() taID: string;
  @Input() unitID: string;
  @Input() optionsID: string;

  constructor() { }

  ngOnInit(): void {
  }

}
