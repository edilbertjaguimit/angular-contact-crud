import {
  Component,
  ElementRef,
  inject,
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
            Add Contact
          </button>
          <input
            type="text"
            hlmInput
            class="h-8 px-3 py-2"
            placeholder="Search"
          />
        </div>
        <hlm-table class="mt-5">
          <hlm-trow>
            <hlm-th class="flex-1">Id</hlm-th>
            <hlm-th class="flex-1">Name</hlm-th>
            <hlm-th class="flex-1">Email</hlm-th>
            <hlm-th class="flex-1">Mobile Number</hlm-th>
            <hlm-th class="flex-1">Address</hlm-th>
            <hlm-th class="flex-1">Status</hlm-th>
          </hlm-trow>
          @for(contact of contacts(); track $index){
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

  contacts = signal<Contact[]>([]);

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
