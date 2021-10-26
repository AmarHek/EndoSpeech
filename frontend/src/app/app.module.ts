import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";

import {AppComponent} from "@app/app.component";
import {FeatureModule} from "@app/feature/feature.module";
import {SharedModule} from "@app/shared/shared.module";
import {ViewModule} from "@app/view/view.module";
import {AppRoutingModule} from "@app/app-routing.module";
import {APP_DATE_FORMATS, AppDateAdapter} from "@app/helpers";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FeatureModule,
    SharedModule,
    ViewModule
  ],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}],
  bootstrap: [AppComponent]
})
export class AppModule { }
