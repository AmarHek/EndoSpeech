import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RecordModel, FreezeModel} from "@app/models";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root"
})
export class RecordRequestsService {

  recordUrl = environment.backend + environment.recordDatabase;
  freezeUrl = environment.backend + environment.freezeDatabase;

  constructor(private http: HttpClient) { }

  addRecord(newRecord: RecordModel) {
    if (newRecord.timestamp === undefined) {
      newRecord.timestamp = Math.round(+new Date()/1000);
    }
    return this.http.post<{message: string; recordId: string}>(this.recordUrl + "addRecord", newRecord);
  }

  getRecordsBySessionID(sessionID: string) {
    // TODO: Add query options
    // TODO: test
    const query = {
      sessionID
    };

    return this.http.post<{message: string; records: any }>(this.recordUrl + "getRecords", query);
  }

  getRecordsAndFreezes(sessionID: string) {
    return this.http.post<{freezes: FreezeModel[], records: RecordModel[], message: string}>(
      this.freezeUrl + "getAll", {sessionID}
    );
  }

  updateFreeze(freezeID: string, textID: string) {
    return this.http.post<{message: string}>(this.freezeUrl + "update/",
      {
        freezeID,
        textID
      });
  }

  onlyGetRecordsAndFreezes(sessionID: string) {
    return this.http.post<{freezes: FreezeModel[], records: RecordModel[], message: string}>(
      this.freezeUrl + "onlyGetAll", {sessionID}
    );
  }
}
