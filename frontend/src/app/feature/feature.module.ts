import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { EditStructureComponent } from "@app/feature";

import {AdvancedComponent, ListComponent, HierarchischComponent,
  RecordComponent, RecordOutputComponent} from "@app/feature";
import {SharedModule} from "@app/shared/shared.module";


@NgModule({
  declarations: [
    AdvancedComponent,
    ListComponent,
    HierarchischComponent,
    RecordComponent,
    RecordOutputComponent,
    EditStructureComponent
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
    RecordOutputComponent,
    EditStructureComponent
  ]
})
export class FeatureModule { }
