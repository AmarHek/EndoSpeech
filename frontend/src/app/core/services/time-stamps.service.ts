import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeStampsService {

  times: any[] = [];

  months: string[] = ["Januar", "Februar", "März","April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];


  addTimeStamp(cur_da: any){
    let formatted_date = cur_da.getDate() + ". " + this.months[cur_da.getMonth()] + " " + cur_da.getFullYear() + ", um " + cur_da.getHours() + ":" + cur_da.getMinutes() + " Uhr";
    this.times.push(formatted_date);
  }

  removeTimeStamp(index: number){
    this.times.splice(index,1);
  }

  constructor() { }
}
