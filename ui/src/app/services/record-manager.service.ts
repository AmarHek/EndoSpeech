import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Recording} from "../../helper-classes/recording";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class RecordManagerService {

  databaseUrl = environment.urlRootMongo;

  constructor(private http: HttpClient) { }

  addRecord(newRecord: Recording) {
    if (newRecord.timestamp === undefined) {
      newRecord.timestamp = new Date();
    }

    this.http.post<{message: string; recordId: string}>(this.databaseUrl + "record", newRecord)
      .subscribe((response) => {
        console.log(response.message);
        console.log("ID: " + response.recordId);
      }
    );
  }

  getRecords() {
    // TODO: Add query options
    this.http.get(this.databaseUrl + "record").subscribe((fetchedRecords) => {
      console.log(fetchedRecords);
    });
  }

}
