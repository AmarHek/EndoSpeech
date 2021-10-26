import { Injectable } from "@angular/core";
import * as M from "@app/models/dictModel";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import {Dict} from "@app/models";

@Injectable({
  providedIn: "root",
})

// -----------------------------------
// This class administrates the list of dicts and executes all api calls
// -----------------------------------

export class DictRequestsService {
  dictList: Array<M.Dict> = [];
  private listUpdated = new Subject<M.Dict[]>();

  databaseUrl = environment.backend + environment.dictDatabase;

  constructor(private http: HttpClient) {
  }

  getDictById(id: string) {
    return this.http.get<Dict>(this.databaseUrl + id);
  }

  addDict(newDict: M.Dict) {
    return this.http
      .post<{ message: string; dictId: string }>(
        this.databaseUrl,
        newDict
      );
  }

  addDictFromJSON(jsonData: FormData) {
    return this.http.post<{message: string; dictID: string }>(
      this.databaseUrl + "json/",
      jsonData
    );
  }

  deleteDict(id: string) {
    return this.http.delete(this.databaseUrl + id);
  }

  getList() {
    return this.http.get<Dict[]>(this.databaseUrl);
  }

  updateDict(changeDict: M.Dict) {
    this.http
      .put(this.databaseUrl + changeDict._id, {
        parts: changeDict.parts,
        name: changeDict.name,
      })
      .subscribe((response) => {
        this.dictList[this.dictList.findIndex((d) => d._id === changeDict._id)] = changeDict;
        this.listUpdated.next([...this.dictList]);
      });
  }

  /*
  addExcel(postData: FormData) {
    this.http
      .post<{ message: string; dictId: string }>(
        this.databaseUrl + "excel",
        postData
      )
      .subscribe((res) => {
        let str = "";
        if (res.dictId === "false") {
          str =
            "Fehler beim Hochladen der Excel Datei. Die Tabelle wurde nicht korrekt befüllt. \n Folgender Fehler ist aufgetreten: \n\n";
        }
        window.alert(str + res.message);
      });
  } */
}

// This is for Radiology



