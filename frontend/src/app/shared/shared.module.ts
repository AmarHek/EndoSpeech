import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from "@angular/material/divider";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {
  ConfirmDialogComponent,
  DialogComponent,
  ReportComponent,
  SortCategoriesPipe,
  UploadComponent
} from "@app/shared";

import {VariableComponent} from "@app/shared/variable/variable.component";
import {DiseaseComponent} from "@app/shared/disease/disease.component";
import {AttributeComponent} from "@app/shared/attribute/attribute.component";

@NgModule({
  declarations: [
    ReportComponent,
    UploadComponent,
    DialogComponent,
    ConfirmDialogComponent,
    SortCategoriesPipe,
    VariableComponent,
    DiseaseComponent,
    AttributeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    NgbModule
  ],
  exports: [
    ReportComponent,
    UploadComponent,
    DialogComponent,
    ConfirmDialogComponent,
    SortCategoriesPipe,
    VariableComponent,
    DiseaseComponent,
    AttributeComponent
  ]
})
export class SharedModule { }
