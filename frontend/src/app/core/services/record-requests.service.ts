import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RecordModel} from "@app/models";
import { environment } from "@env/environment";
import {Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class RecordRequestsService {

  databaseUrl = environment.backend + environment.recordDatabase;

  constructor(private http: HttpClient) { }

  addRecord(newRecord: RecordModel) {
    if (newRecord.timestamp === undefined) {
      newRecord.timestamp = new Date();
    }
    return this.http.post<{message: string; recordId: string}>(this.databaseUrl + "addRecord", newRecord);
  }

  getRecordsBySessionID(sessionID: string) {
    // TODO: Add query options
    // TODO: test
    const query = {
      sessionID
    };

    return this.http.post<{message: string; records: any }>(this.databaseUrl + "getRecords", query);
  }

}
