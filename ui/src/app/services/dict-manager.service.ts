import { Injectable } from "@angular/core";
import * as N from "../../helper-classes/model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";

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
          console.log(getter.dicts);
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

  addDict(myDict: N.Dict) {
    this.http
      .post<{ message: string; dictId: string }>(
        this.databaseUrl,
        myDict
      )
      .subscribe((response) => {
        myDict.id = response.dictId;
        this.dictList.push(myDict);
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

  updateDict(myDict: N.Dict) {
    this.http
      .put(this.databaseUrl + myDict.id, {
        parts: myDict.parts,
        name: myDict.name,
      })
      .subscribe((response) => {
        this.dictList[this.dictList.findIndex((d) => d.id === myDict.id)] = myDict;
        this.listUpdated.next([...this.dictList]);
      });
  }
}

// This is for Radiology



