import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from "@angular/material/divider";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {
  ConfirmDialogComponent,
  ReportComponent,
  SortCategoriesPipe,
  UploadComponent
} from "@app/shared";

import {VariableComponent} from "@app/shared/variable/variable.component";
import {DiseaseComponent} from "@app/shared/disease/disease.component";
import {AttributeComponent} from "@app/shared/attribute/attribute.component";
import { LoginComponent } from './login/login.component';
import { EditRecordDialogComponent } from './edit-record-dialog/edit-record-dialog.component';

@NgModule({
  declarations: [
    ReportComponent,
    UploadComponent,
    ConfirmDialogComponent,
    SortCategoriesPipe,
    VariableComponent,
    DiseaseComponent,
    AttributeComponent,
    LoginComponent,
    EditRecordDialogComponent
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
    ConfirmDialogComponent,
    SortCategoriesPipe,
    VariableComponent,
    DiseaseComponent,
    AttributeComponent,
    LoginComponent,
    EditRecordDialogComponent
  ]
})
export class SharedModule { }
