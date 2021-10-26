import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DictManagerService,
  DisplayService,
  InputParserService,
  InputParserHierarchischService,
  ParserBasisService,
  RecordManagerService,
  TextOutputService,
  TimeStampsService,
  TableOutputService
} from "@app/core";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    DictManagerService,
    DisplayService,
    InputParserHierarchischService,
    InputParserService,
    ParserBasisService,
    RecordManagerService,
    TextOutputService,
    TimeStampsService,
    TableOutputService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if(core) {
      throw new Error("No");
    }
  }
}
