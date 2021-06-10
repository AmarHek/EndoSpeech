import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from "./app.component";
import { AdvancedComponent } from "./gastro-components/advanced/advanced.component";
import { HierarchischComponent } from "./gastro-components/hierarchisch/hierarchisch.component";
import { UploadComponent } from "./base-components/upload/upload.component";
import { ListComponent } from "./base-components/list/list.component";
import { SortCategoriesPipe } from "./pipes/sort-categories.pipe";
import { ReportComponent } from "./base-components/report/report.component";
import { UiBaseComponent } from "./radio-components/ui-base/ui-base.component";
import { OptionsComponent } from "./radio-components/options/options.component";
import { HeaderComponent } from "./base-components/header/header.component";
import { VariablesComponent } from "./variables/variables.component";
import { InputModalComponent } from "./variables/inputModal/inputModal.component";
import { ConfirmDialogComponent } from "./base-components/confirm-dialog/confirm-dialog.component";
import { EditStructureComponent } from "./edit-structure/edit-structure.component";
import { DiseaseComponent } from "./edit-structure/disease/disease.component";
import { VariableComponent } from "./edit-structure/variable/variable.component";
import { AttributeComponent } from "./edit-structure/attribute/attribute.component";
import {DisplayService} from "./services/display.service";
import {ParserBasisService} from "./services/parser-basis.service";
import {DateAdapter, MAT_DATE_FORMATS} from "@angular/material/core";
import {APP_DATE_FORMATS, AppDateAdapter} from "../helper-classes/format-datepicker";
import { UploadModalComponent } from './gastro-components/upload-modal/upload-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AdvancedComponent,
    HierarchischComponent,
    UploadComponent,
    ListComponent,
    SortCategoriesPipe,
    ReportComponent,
    UiBaseComponent,
    OptionsComponent,
    HeaderComponent,
    VariablesComponent,
    InputModalComponent,
    ConfirmDialogComponent,
    EditStructureComponent,
    DiseaseComponent,
    VariableComponent,
    AttributeComponent,
    UploadModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        { path: "Radiologie/:name", component: UiBaseComponent},
        { path: "Gastroenterologie/Fortgeschritten/:name", component: AdvancedComponent},
        { path: "Gastroenterologie/Hierarchisch/:name", component: HierarchischComponent},
        { path: "upload",     component: UploadComponent },
        { path: "list",       component: ListComponent   },
        { path: "edit/:name", component: EditStructureComponent},
        { path: "**", redirectTo: "/upload" },
      ],
      { useHash: true, relativeLinkResolution: "legacy" }
    )
  ],
  providers: [DisplayService, ParserBasisService,
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}],
  bootstrap: [AppComponent]
})
export class AppModule { }
