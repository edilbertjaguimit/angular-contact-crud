import { Component } from '@angular/core';
import { HomeComponent } from './components/home.component';
import { NavbarComponent } from './components/navbar.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, NavbarComponent],
  template: `
    <div class="h-screen">
      <app-navbar />
      <div class="p-5 ml-64">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: ``,
})
export class AppComponent {
  title = 'contact-crud';
}
