import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Record, Freeze} from "@app/models";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root"
})
export class RecordFreezeApiService {

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
  }

  addRecord(newRecord: Record) {
    if (newRecord.timestamp === undefined) {
      newRecord.timestamp = Math.round(+new Date()/1000);
    }
    return this.http.post<{message: string; recordID: string}>(this.recordUrl + "addRecord", newRecord);
  }

  updateRecord(recordID: string, newContent: string) {
    return this.http.post<{message: string}>(this.recordUrl + "updateRecord",
      {
        recordID: recordID,
        content: newContent
      });
  }

  deleteRecord(recordID: string) {
    return this.http.post<{message: string}>(this.recordUrl + "deleteRecord",
      {
        recordID
      });
  }

  getRecordsBySessionID(sessionID: string) {
    const query = {
      sessionID
    };

    return this.http.post<{message: string; records: any }>(this.recordUrl + "getRecords", query);
  }

  fetchFreezesToBackend(sessionID: string) {
    return this.http.post<{freezes: Freeze[], records: Record[], message: string}>(
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

  getFreezes(sessionID: string) {
    return this.http.post<{freezes: Freeze[], message: string}>(
      this.freezeUrl + "getFreezes", {sessionID}
    );
  }

  getApiRecordID() {
    return this.http.post<{id: string, resourceUrl: string}>(
      environment.api + "PostNewLiveExamination",
      {},
      this.httpOptions
    );
  }

  saveToApi(imageFile: File, description: string, recordId: string) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('file', imageFile);
    formData.append('recordId', recordId);
    return this.http.post<{imageUrl: string, reportUrl: string}>(
      environment.api + "PostLiveReportData",
      formData,
      this.httpOptions);
  }

  setHttpHeaders(username: string, password: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(username + ":" + password)
      })
    }
  }

  getFreezeAsFile(imageUrl: string) {
    return this.http.get(imageUrl, {responseType: "blob"});
  }
}
