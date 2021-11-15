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
  }

  addRecord(newRecord: RecordModel) {
    if (newRecord.timestamp === undefined) {
      newRecord.timestamp = Math.round(+new Date()/1000);
    }
    return this.http.post<{message: string; recordId: string}>(this.recordUrl + "addRecord", newRecord);
  }

  updateRecord(recordID: string, newContent: string) {
    return this.http.post<{message: string}>(this.recordUrl + "updateRecord",
      {
        recordID,
        newContent
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
}
