import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Record} from "../models/record";
import { environment } from "../../environments/environment";
import {Subject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class RecordManagerService {

  databaseUrl = environment.urlRootMongo;

  constructor(private http: HttpClient) { }

  addRecord(newRecord: Record) {
    if (newRecord.timestamp === undefined) {
      newRecord.timestamp = new Date();
    }

    this.http.post<{message: string; recordId: string}>(this.databaseUrl + "addRecord", newRecord)
      .subscribe((response) => {
        console.log(response.message);
        console.log("ID: " + response.recordId);
      }
    );
  }

  getRecords(sessionID: string) {
    // TODO: Add query options
    // TODO: test
    const query = {
      sessionID
    };

    const subjectRecord = new Subject<Record[]>();

    this.http.post<{message: string; records: any }>(
      this.databaseUrl + "getRecord", query)
      .subscribe((res) => {
        const records = res.records.map(record => ({
            sessionID: record.sessionID,
            content: record.content,
            timestamp: new Date(record.timestamp)
          }));
        subjectRecord.next(records);
        }
    );
    return subjectRecord;
  }

}
