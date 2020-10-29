import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public originalDraw: any;
  public latestDraw: any;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<any>(baseUrl + 'Stryktipset/get-draw').subscribe(result => {
      this.originalDraw.draws[0] = JSON.parse(result.original);
      this.latestDraw = result.latest != null ? JSON.parse(result.latest).draws[0] : null;
    }, error => console.error(error));
  }
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
