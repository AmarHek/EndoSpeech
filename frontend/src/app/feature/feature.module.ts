import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import {AdvancedComponent, ListComponent, HierarchischComponent,
  RecordComponent, TableOutputComponent} from "@app/feature";
import {SharedModule} from "@app/shared/shared.module";


@NgModule({
  declarations: [
    AdvancedComponent,
    ListComponent,
    HierarchischComponent,
    RecordComponent,
    TableOutputComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    AdvancedComponent,
    ListComponent,
    HierarchischComponent,
    RecordComponent,
    TableOutputComponent
  ]
})
export class FeatureModule { }
