import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DictRequestsService,
  DisplayService,
  InputParserService,
  InputParserHierarchischService,
  ParserBasisService,
  RecordRequestsService,
  TextOutputService,
  TableOutputService,
  MatDialogService
} from "@app/core";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    DictRequestsService,
    DisplayService,
    InputParserHierarchischService,
    InputParserService,
    ParserBasisService,
    RecordRequestsService,
    TextOutputService,
    TableOutputService,
    MatDialogService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if(core) {
      throw new Error("No");
    }
  }
}

