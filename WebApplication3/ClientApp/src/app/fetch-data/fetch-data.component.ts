import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  styleUrls: ['./fetch-data.component.css']
})
export class FetchDataComponent {
  public originalDraw: any;
  public latestDraw: any;
  public weekNumber: number;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<any>(baseUrl + 'Stryktipset/get-draw').subscribe(result => {
      this.weekNumber = result.weekNumber;
      this.originalDraw = JSON.parse(result.original).draws[0];
      this.latestDraw = result.latest != null ? JSON.parse(result.latest).draws[0] : null;
    }, error => console.error(error));
  }

  getLatestOddsOne(eventNumber: number) {
    return this.latestDraw != null ? this.latestDraw.drawEvents[eventNumber - 1].odds.one : '-'
  }

  getLatestOddsX(eventNumber: number) {
    return this.latestDraw != null ? this.latestDraw.drawEvents[eventNumber - 1].odds.x : '-'
  }

  getLatestOddsTwo(eventNumber: number) {
    return this.latestDraw != null ? this.latestDraw.drawEvents[eventNumber - 1].odds.two : '-'
  }

  getColorOddsOne(eventNumber: number) {
    if (this.latestDraw != null) {
      if (this.latestDraw.drawEvents[eventNumber - 1].odds.one == this.originalDraw.drawEvents[eventNumber - 1].odds.one) return 'black';

      return this.latestDraw.drawEvents[eventNumber - 1].odds.one > this.originalDraw.drawEvents[eventNumber - 1].odds.one ? 'green' : 'red';
    }

    return 'black';
  }

  getColorOddsX(eventNumber: number) {
    if (this.latestDraw != null) {
      if (this.latestDraw.drawEvents[eventNumber - 1].odds.x == this.originalDraw.drawEvents[eventNumber - 1].odds.x) return 'black';

      return this.latestDraw.drawEvents[eventNumber - 1].odds.x > this.originalDraw.drawEvents[eventNumber - 1].odds.x ? 'green' : 'red';
    }

    return 'black';
  }

  getColorOddsTwo(eventNumber: number) {
    if (this.latestDraw != null) {
      if (this.latestDraw.drawEvents[eventNumber - 1].odds.two == this.originalDraw.drawEvents[eventNumber - 1].odds.two) return 'black';

      return this.latestDraw.drawEvents[eventNumber - 1].odds.two > this.originalDraw.drawEvents[eventNumber - 1].odds.two ? 'green' : 'red';
    }

    return 'black';
  }
}
