import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Record, Freeze} from "@app/models";
import {environment} from "@env/environment";

@Injectable({
  providedIn: "root"
})
export class RecordFreezeApiService {

  recordUrl = environment.backend + environment.recordDatabase;
  freezeUrl = environment.backend + environment.freezeDatabase;
  serialUrl = environment.backend + environment.serial;
  apiUrl = environment.backend + environment.api;

  constructor(private http: HttpClient) {
  }

  addRecord(newRecord: Record) {
    if (newRecord.timestamp === undefined) {
      newRecord.timestamp = Math.round(+new Date() / 1000);
    }
    return this.http.post<{ message: string; recordID: string }>(this.recordUrl + "addRecord", newRecord);
  }

  updateRecord(recordID: string, newContent: string) {
    return this.http.post<{ message: string }>(this.recordUrl + "updateRecord",
      {
        recordID: recordID,
        content: newContent
      });
  }

  deleteRecord(recordID: string) {
    return this.http.post<{ message: string }>(this.recordUrl + "deleteRecord",
      {
        recordID
      });
  }

  getRecordsBySessionID(sessionID: string) {
    const query = {
      sessionID
    };

    return this.http.post<{ message: string; records: any }>(this.recordUrl + "getRecords", query);
  }

  fetchFreezesToBackend(sessionID: string) {
    return this.http.post<{ freezes: Freeze[], records: Record[], message: string }>(
      this.freezeUrl + "fetch", {sessionID}
    );
  }

  updateFreeze(freezeID: string, textIDs: string[]) {
    return this.http.post<{ message: string }>(this.freezeUrl + "update/",
      {
        freezeID,
        textIDs
      });
  }

  getFreezesBySessionID(sessionID: string) {
    return this.http.post<{ freezes: Freeze[], message: string }>(
      this.freezeUrl + "getFreezes", {sessionID}
    );
  }

  saveToApi(sessionID: string, records: Record[], freezes: Freeze[]) {

    return this.http.post<{ message: string }>(
      this.apiUrl + "submit",
      {
        sessionID,
        records,
        freezes
      });
  }

  sendToSerial(report: string): void {
    if (report) {
      this.http.post<any>(this.serialUrl + "sendToSerial", {report: report}).subscribe(()=>{
        console.log("Report:" + report + " has been sent");
      });
    }
  }
}
