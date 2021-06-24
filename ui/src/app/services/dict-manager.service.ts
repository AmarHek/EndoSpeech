import { Injectable } from "@angular/core";
import * as N from "../../helper-classes/gastro_model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import {DisplayService} from "./display.service";

const url = environment.urlRootEndo;

@Injectable({
  providedIn: "root",
})

// -----------------------------------
// This class administrates the list of dicts and executes all api calls
// -----------------------------------

export class DictManagerService {
  myList: Array<N.MyDict> = [];
  private listUpdated = new Subject<N.MyDict[]>();

  myUrl = url;
  mode: string;
  ui: string;

  constructor(private http: HttpClient,
              private displayService: DisplayService) {
    this.setMode();
    this.setUI();
    this.getList();
  }

  setUrl(mode: string) {
    if (mode === "Radiologie") {
      this.myUrl += "radio/";
    }
  }

  setMode() {
    this.displayService.getMode().subscribe((value) => {
      this.mode = value;
    });
  }

  setUI() {
    this.displayService.getUi().subscribe((value) => {
      this.ui = value;
    });
  }

  getList() {
    this.http
      .get<{ message: string; myDicts: any }>(
       this.myUrl
      )
      .pipe(
        map((getter) => {
          return getter.myDicts.map((retDict) => {
            return {
              id: retDict._id,
              dict: retDict.dict,
              name: retDict.name,
            };
          });
        })
      )
      .subscribe((transData) => {
        this.myList = transData;
        this.listUpdated.next([...this.myList]);
      });
  }

  getListUpdateListener() {
    return this.listUpdated.asObservable();
  }

  remove(id: string): void {
    this.http
      .delete(this.myUrl + id)
      .subscribe(() => {
        this.myList = this.myList.filter((dict) => dict.id !== id);
        this.listUpdated.next([...this.myList]);
        // this.myList = update;
      });
    // this.timesService.removeTimeStamp(index);
  }

  addDict(myDict: N.MyDict) {
    this.http
      .post<{ message: string; dictId: string }>(
        this.myUrl,
        myDict
      )
      .subscribe((response) => {
        myDict.id = response.dictId;
        this.myList.push(myDict);
      });
  }

  addExcel(postData: FormData) {
    this.http
      .post<{ message: string; dictId: string }>(
        this.myUrl + "excel",
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
      .put(this.myUrl + myDict.id, {
        dict: myDict.dict,
        name: myDict.name,
      })
      .subscribe((response) => {
        this.myList[this.myList.findIndex((d) => d.id === myDict.id)] = myDict;
        this.listUpdated.next([...this.myList]);
      });
  }
}

// This is for Radiology



