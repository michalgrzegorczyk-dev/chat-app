import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class DataSyncer {

  scheduleMessage() {
    console.log('Message scheduled');
  }
}
