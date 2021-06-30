import { Injectable } from "@angular/core";
import * as N from "../../helper-classes/gastro_model";
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
  dictList: Array<N.MyDict> = [];
  private listUpdated = new Subject<N.MyDict[]>();

  databaseUrl = environment.urlRootEndo;

  constructor(private http: HttpClient) {
    this.getList();
  }

  getList() {
    this.http
      .get<{ message: string; dictionaries: any }>(
       this.databaseUrl
      )
      .pipe(
        map((getter) => {
          return getter.dictionaries.map((retDict) => {
            return {
              id: retDict._id,
              dict: retDict.dict,
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

  addDict(myDict: N.MyDict) {
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

  updateDict(myDict: N.MyDict) {
    this.http
      .put(this.databaseUrl + myDict.id, {
        dict: myDict.dict,
        name: myDict.name,
      })
      .subscribe((response) => {
        this.dictList[this.dictList.findIndex((d) => d.id === myDict.id)] = myDict;
        this.listUpdated.next([...this.dictList]);
      });
  }
}

// This is for Radiology



