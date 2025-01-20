import {
  Component,
  computed,
  ElementRef,
  inject,
  model,
  signal,
  ViewChild,
} from '@angular/core';
import { HlmTableDirective } from '@spartan-ng/ui-table-helm';
import { HlmTableComponent } from '../../../libs/ui/ui-table-helm/src/lib/hlm-table.component';
import { HlmCaptionComponent } from '../../../libs/ui/ui-table-helm/src/lib/hlm-caption.component';
import { HlmTrowComponent } from '../../../libs/ui/ui-table-helm/src/lib/hlm-trow.component';
import { HlmThComponent } from '../../../libs/ui/ui-table-helm/src/lib/hlm-th.component';
import { HlmTdComponent } from '../../../libs/ui/ui-table-helm/src/lib/hlm-td.component';
import { ContactService } from '../services/contact.service';
import { Subject, takeUntil } from 'rxjs';
import { Contact } from '../models/contact.model';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { AddOrEditContactComponent } from './add-or-edit-contact.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    HlmTableComponent,
    HlmCaptionComponent,
    HlmTrowComponent,
    HlmThComponent,
    HlmTdComponent,
    HlmInputDirective,
    HlmButtonDirective,
    AddOrEditContactComponent,
    FormsModule,
  ],
  template: `
    <div class="w-full">
      <h1 class="text-3xl font-bold">Contacts</h1>
      <div class="overflow-x-auto p-2 mt-5">
        <div class="flex justify-between">
          <button
            type="button"
            hlmBtn
            class="h-8 px-3 py-2"
            (click)="openModal()"
          >
            <i class="fa-solid fa-user-plus"></i>
          </button>
          <input
            type="text"
            hlmInput
            class="h-8 px-3 py-2"
            placeholder="Search"
            [(ngModel)]="search"
          />
        </div>
        <hlm-table class="mt-5">
          <hlm-trow>
            <hlm-th class="flex-1">Id</hlm-th>
            <hlm-th class="flex-1 text-start">Name</hlm-th>
            <hlm-th class="flex-1">Email</hlm-th>
            <hlm-th class="flex-1">Mobile Number</hlm-th>
            <hlm-th class="flex-1">Address</hlm-th>
            <hlm-th class="flex-1">Status</hlm-th>
            <hlm-th class="flex-1">Action</hlm-th>
          </hlm-trow>
          @for(contact of filteredContacts(); track $index){
          <hlm-trow>
            <hlm-td class="flex-1">{{ contact.contactId }}</hlm-td>
            <hlm-td class="flex-1 text-nowrap"
              >{{ contact.contactFirstName }}
              {{ contact.contactLastName }}</hlm-td
            >
            <hlm-td class="flex-1">{{ contact.contactEmail }}</hlm-td>
            <hlm-td class="flex-1">{{ contact.contactMobileNumber }}</hlm-td>
            <hlm-td class="flex-1">{{ contact.contactAddress }}</hlm-td>
            <hlm-td class="flex-1">{{ contact.contactStatus }}</hlm-td>
            <hlm-td class="flex-1 flex gap-1">
              <button
                type="button"
                hlmBtn
                class="h-7 px-2 py-1 bg-transparent text-black border hover:text-white"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button
                type="button"
                hlmBtn
                class="h-7 px-2 py-1 bg-red-500 hover:opacity-80 hover:bg-red-500"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </hlm-td>
          </hlm-trow>
          }
        </hlm-table>
      </div>
      <hlm-caption>A list of recent contacts.</hlm-caption>
    </div>
    <app-add-or-edit-contact />
  `,
  styles: ``,
})
export class ContactComponent {
  @ViewChild(AddOrEditContactComponent)
  addOrEditContact!: AddOrEditContactComponent;

  private readonly contactService = inject(ContactService);
  private readonly destryoed$ = new Subject<void>();
  search = model('');

  contacts = signal<Contact[]>([]);

  filteredContacts = computed(() => {
    return this.contacts().filter(
      (contact) =>
        contact.contactFirstName.toLocaleLowerCase().includes(this.search()) ||
        contact.contactLastName.toLocaleLowerCase().includes(this.search()) ||
        contact.contactEmail.toLocaleLowerCase().includes(this.search())
    );
  });

  ngOnInit() {
    this.contactService
      .getContacts()
      .pipe(takeUntil(this.destryoed$))
      .subscribe({
        next: (contacts: Contact[]) => {
          console.log(contacts);
          this.contacts.set(contacts);
        },
      });
  }

  ngOnDestroy() {
    this.destryoed$.next();
    this.destryoed$.complete();
  }

  openModal() {
    this.addOrEditContact.openModal();
  }
}
