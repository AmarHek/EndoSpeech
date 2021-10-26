import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ListComponent, AdvancedComponent, HierarchischComponent,
          RecordComponent, EditStructureComponent, TableOutputComponent} from "@app/feature";
import { UploadComponent } from "@app/shared";

const routes: Routes = [
  {
    path: "list",
    component: ListComponent
  },
  {
    path: "main/Fortgeschritten/:id",
    component: AdvancedComponent
  },
  {
    path: "main/Hierarchisch/:id",
    component: HierarchischComponent
  },
  {
    path: "upload",
    component: UploadComponent
  },
  {
    path: "record",
    component: RecordComponent
  },
  {
    path: "edit/:name",
    component: EditStructureComponent
  },
  {
    path: "output",
    component: TableOutputComponent
  },
  {path: "**", redirectTo: "/list"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
