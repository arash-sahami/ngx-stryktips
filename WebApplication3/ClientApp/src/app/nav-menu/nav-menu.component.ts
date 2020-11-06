import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private router: Router) {

  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  cleanData() {
    if (window.confirm("Är du säker på att tidigare hämtningar?")) {
      this.http.get<any>(this.baseUrl + 'Stryktipset/clean').subscribe(result => {
        this.router.navigate(['/']);
      }, error => console.error(error));
    }
  }
}
