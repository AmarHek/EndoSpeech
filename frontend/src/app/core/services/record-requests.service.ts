import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RecordModel, FreezeModel} from "@app/models";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root"
})
export class RecordRequestsService {

  recordUrl = environment.backend + environment.recordDatabase;
  freezeUrl = environment.backend + environment.freezeDatabase;

  username = "endo";
  password = "ukw$1ukw$1ukw$1";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(this.username + ":" + this.password)
    })
  }

  constructor(private http: HttpClient) {
    this.testapi().subscribe(res => {
      console.log(res);
    })
  }

  addRecord(newRecord: RecordModel) {
    if (newRecord.timestamp === undefined) {
      newRecord.timestamp = Math.round(+new Date()/1000);
    }
    return this.http.post<{message: string; recordId: string}>(this.recordUrl + "addRecord", newRecord);
  }

  getRecordsBySessionID(sessionID: string) {
    const query = {
      sessionID
    };

    return this.http.post<{message: string; records: any }>(this.recordUrl + "getRecords", query);
  }

  fetchFreezesFromFolderToBackend(sessionID: string) {
    return this.http.post<{freezes: FreezeModel[], records: RecordModel[], message: string}>(
      this.freezeUrl + "fetch", {sessionID}
    );
  }

  updateFreeze(freezeID: string, textID: string) {
    return this.http.post<{message: string}>(this.freezeUrl + "update/",
      {
        freezeID,
        textID
      });
  }

  getRecordsAndFreezes(sessionID: string) {
    return this.http.post<{freezes: FreezeModel[], records: RecordModel[], message: string}>(
      this.freezeUrl + "getAll", {sessionID}
    );
  }

  testapi() {
    return this.http.post(environment.api + "PostNewLiveExamination", {}, this.httpOptions);
  }
}
