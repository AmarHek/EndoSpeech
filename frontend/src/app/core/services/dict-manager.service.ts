import { Injectable } from "@angular/core";
import * as N from "@app/models/model";
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

export class DictManagerService {
  dictList: Array<N.Dict> = [];
  private listUpdated = new Subject<N.Dict[]>();

  databaseUrl = environment.urlRootMongo;

  constructor(private http: HttpClient) {
    this.getList();
  }

  getList() {
    this.http
      .get<{ message: string; dicts: any }>(
        this.databaseUrl
      )
      .pipe(
        map((getter) => {
          return getter.dicts.map((retDict) => {
            return {
              id: retDict._id,
              parts: retDict.parts,
              name: retDict.name,
            };
          });
        })
      )
      .subscribe((transData) => {
        this.dictList = transData;
        this.listUpdated.next([...this.dictList]);
      });
  }

  getListUpdateListener() {
    return this.listUpdated.asObservable();
  }

  getDictByName(name: string) {
    const query = {
      name
    };
    return this.http.post<{ message: string, dict: any }>(
      this.databaseUrl + "single", query)
      .subscribe((res) => res.dict as Dict);
  }

  remove(id: string): void {
    this.http
      .delete(this.databaseUrl + id)
      .subscribe(() => {
        this.dictList = this.dictList.filter((dict) => dict.id !== id);
        this.listUpdated.next([...this.dictList]);
        // this.myList = update;
      });
    // this.timesService.removeTimeStamp(index);
  }

  addDict(newDict: N.Dict) {
    this.http
      .post<{ message: string; dictId: string }>(
        this.databaseUrl,
        newDict
      )
      .subscribe((response) => {
        newDict.id = response.dictId;
        this.dictList.push(newDict);
      });
  }

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
  }

  updateDict(changeDict: N.Dict) {
    this.http
      .put(this.databaseUrl + changeDict.id, {
        parts: changeDict.parts,
        name: changeDict.name,
      })
      .subscribe((response) => {
        this.dictList[this.dictList.findIndex((d) => d.id === changeDict.id)] = changeDict;
        this.listUpdated.next([...this.dictList]);
      });
  }
}

// This is for Radiology



