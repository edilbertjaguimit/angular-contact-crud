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
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../shared/modal.component';

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
    ModalComponent,
    ReactiveFormsModule,
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
            (click)="openModalAddOrEdit()"
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
          <!-- Loop through the contacts -->
          @if(filteredContacts().length !== 0){ @for(contact of
          filteredContacts(); track $index){
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
                (click)="openModalAddOrEdit(contact.contactId)"
              >
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button
                type="button"
                hlmBtn
                class="h-7 px-2 py-1 bg-red-500 hover:opacity-80 hover:bg-red-500"
                (click)="openDeleteModal(contact.contactId)"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </hlm-td>
          </hlm-trow>
          } } @else{
          <hlm-trow>
            <hlm-td class="flex-1 justify-center" colspan="6"
              >No contacts found.</hlm-td
            >
          </hlm-trow>
          }
        </hlm-table>
      </div>
      <hlm-caption>A list of recent contacts.</hlm-caption>
    </div>
    <app-add-or-edit-contact
      [contactAddOrEditForm]="contactAddOrEditForm"
      (handleSubmit)="handleSubmit()"
    />
    <app-modal
      title="Delete Contact"
      body="Are you sure you want to delete this contact?"
      buttonTitle="Delete"
      (deleteClick)="deleteContact()"
    />
  `,
  styles: ``,
})
export class ContactComponent {
  @ViewChild(AddOrEditContactComponent)
  addOrEditContact!: AddOrEditContactComponent; // This is the AddOrEditContactComponent that we will use to open the modal. You use this when you want to access a child component's properties or methods from a parent component.
  @ViewChild(ModalComponent) modalWrapper!: ModalComponent; // This is the ModalComponent that we will use to open the modal. You use this when you want to access a child component's properties or methods from a parent component.

  private readonly contactService = inject(ContactService);
  private readonly destroyed$ = new Subject<void>();
  search = model('');

  contacts = signal<Contact[]>([]);

  contactId = signal<number | undefined>(undefined);

  isLoading = signal(false);
  private formBuilder = inject(FormBuilder);
  public contactAddOrEditForm = this.formBuilder.group({
    id: this.formBuilder.nonNullable.control(0),
    firstName: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    lastName: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    email: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
    mobile: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.pattern(/^[0-9]{11}$/),
    ]),
    address: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    status: this.formBuilder.nonNullable.control('ACTIVE'),
  });

  filteredContacts = computed(() => {
    return this.contacts().filter(
      (contact) =>
        contact.contactFirstName.toLocaleLowerCase().includes(this.search()) ||
        contact.contactLastName.toLocaleLowerCase().includes(this.search()) ||
        contact.contactEmail.toLocaleLowerCase().includes(this.search())
    );
  });

  ngOnInit() {
    this.getContacts();
  }

  getContacts() {
    this.contactService
      .getContacts()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (contacts: Contact[]) => {
          console.log('Get Contacts');
          console.log(contacts);
          this.contacts.set(contacts);
        },
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  openModalAddOrEdit(contactId?: number) {
    console.log(contactId);
    if (contactId !== undefined) {
      console.log('contactId is not undefined');
      this.contactService
        .getContact(contactId!)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (contact) => {
            this.contactAddOrEditForm.patchValue({
              id: contact.contactId,
              firstName: contact.contactFirstName,
              lastName: contact.contactLastName,
              email: contact.contactEmail,
              mobile: contact.contactMobileNumber,
              address: contact.contactAddress,
              status: contact.contactStatus,
            });
            console.log(contact);
          },
        });
    }
    this.addOrEditContact.openModal();
  }

  openDeleteModal(id: number) {
    this.modalWrapper.openModal();
    this.contactId.set(id);
    console.log('Delete contact', id);
  }

  closeModal() {
    this.addOrEditContact.closeModal();
  }

  handleSubmit() {
    if (this.contactAddOrEditForm.invalid) {
      return;
    }

    console.log('submit');
    console.log(this.contactAddOrEditForm.value);

    this.isLoading.set(true);
    if (this.contactAddOrEditForm.value.id === 0) {
      this.contactService
        .addContact({
          contactId: 0,
          contactFirstName: this.contactAddOrEditForm.value.firstName!,
          contactLastName: this.contactAddOrEditForm.value.lastName!,
          contactEmail: this.contactAddOrEditForm.value.email!,
          contactMobileNumber: this.contactAddOrEditForm.value.mobile!,
          contactAddress: this.contactAddOrEditForm.value.address!,
          contactStatus: this.contactAddOrEditForm.value.status!,
        })
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (value) => {
            console.log(value);
            this.isLoading.set(false);
            this.getContacts();
            this.closeModal();
          },
          error: (err) => {
            console.log(err);
            this.isLoading.set(false);
          },
        });
      return;
    }

    this.contactService
      .updateContact({
        contactId: this.contactAddOrEditForm.value.id!,
        contactFirstName: this.contactAddOrEditForm.value.firstName!,
        contactLastName: this.contactAddOrEditForm.value.lastName!,
        contactEmail: this.contactAddOrEditForm.value.email!,
        contactMobileNumber: this.contactAddOrEditForm.value.mobile!,
        contactAddress: this.contactAddOrEditForm.value.address!,
        contactStatus: this.contactAddOrEditForm.value.status!,
      })
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (value) => {
          console.log(value);
          this.isLoading.set(false);
          this.getContacts();
          this.closeModal();
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        },
      });
  }

  deleteContact() {
    console.log('Delete contact 2', this.contactId());
    // Delete contact
    this.contactService
      .deleteContact(this.contactId()!)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          // this.contacts.set(
          //   this.contacts().filter(
          //     (contact) => contact.contactId !== this.contactId()
          //   )
          // );
          this.getContacts();
          this.modalWrapper.closeModal();
        },
        error: (err) => {
          console.error('Failed to delete contact:', err);
        },
      });
  }
}
