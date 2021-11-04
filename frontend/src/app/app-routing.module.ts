import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ListComponent, AdvancedComponent, HierarchischComponent,
          RecordComponent, EditStructureComponent, TableOutputComponent} from "@app/feature";

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
    path: "record",
    component: RecordComponent
  },
  {
    path: "edit/:id",
    component: EditStructureComponent
  },
  {
    path: "output",
    component: TableOutputComponent
  },
  {path: "**", redirectTo: "/record"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
