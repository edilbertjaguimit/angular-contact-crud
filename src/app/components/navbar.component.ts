import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="w-64 h-full fixed top-0 left-0 bg-slate-900 text-lime-50 p-5">
      <h2 class="text-xl font-bold">CRUD</h2>
      <ul class="mt-5 flex flex-col gap-2">
        <li>
          <a
            href="#"
            class="block py-2 px-3 rounded-md cursor-pointer hover:text-slate-400 transition duration-300"
            [routerLink]="['/']"
            [routerLinkActive]="['bg-slate-800']"
            [routerLinkActiveOptions]="{ exact: true }"
            >Home</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block py-2 px-3 rounded-md cursor-pointer hover:text-slate-400 transition duration-300"
            [routerLink]="['/contacts']"
            [routerLinkActive]="['bg-slate-800']"
            >Contacts</a
          >
        </li>
      </ul>
    </nav>
  `,
  styles: ``,
})
export class NavbarComponent {}
