import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";

import { AppComponent } from "./app.component";
import { TextComponent } from "./text/text.component";
import { UploadComponent } from "./upload/upload.component";
import { ListComponent } from "./list/list.component";
import { SortCategoriesPipe } from "./sort-categories.pipe";
import { ReportComponent } from "./report/report.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Layout1Component } from "./layout1/layout1.component";
import { OptionsComponent } from "./options/options.component";
import { HeaderComponent } from "./header/header.component";
import { VariablesComponent } from "./variables/variables.component";

@NgModule({
  declarations: [
    AppComponent,
    TextComponent,
    UploadComponent,
    ListComponent,
    SortCategoriesPipe,
    ReportComponent,
    Layout1Component,
    OptionsComponent,
    HeaderComponent,
    VariablesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    HttpClientModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    RouterModule.forRoot(
      [
        { path: 'layout1/:name', component: Layout1Component},
        { path: 'text/:name', component: TextComponent   },
        { path: 'upload',     component: UploadComponent },
        { path: 'list',       component: ListComponent   },
        { path: '**', redirectTo: '/upload' },
      ],
      { useHash: true }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
