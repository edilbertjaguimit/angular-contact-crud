import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { Contact } from '../models/contact.model';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { ContactService } from '../services/contact.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { stat } from 'fs';

@Component({
  selector: 'app-add-or-edit-contact',
  standalone: true,
  imports: [HlmInputDirective, HlmButtonDirective, ReactiveFormsModule],
  template: `
    <div
      class="absolute z-50 top-0 left-0 w-full h-screen bg-slate-950 bg-opacity-50 text-white opacity-0 pointer-events-none transition-all duration-300"
      #modalWrapper
      (click)="closeModal()"
    >
      <div class="flex items-center justify-center h-full">
        <div
          class="w-96 text-slate-950 bg-slate-50 p-5 rounded-md shadow-2xl"
          (click)="stopPropagation($event)"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-xl">
              {{
                contactAddOrEditForm.value.id === 0
                  ? 'Add Contact'
                  : 'Edit Contact'
              }}
            </h2>
            <button
              type="button"
              class="h-8 px-3 py-2 bg-transparent text-black hover:text-white"
              hlmBtn
              (click)="closeModal()"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <form
            [formGroup]="contactAddOrEditForm"
            (ngSubmit)="handleSubmit.emit()"
          >
            <div class="flex flex-col gap-2 mt-2">
              <label for="">First Name</label>
              <input
                type="text"
                hlmInput
                class="h-8 px-3 py-2"
                formControlName="firstName"
              />
              @if(fieldHasError(contactAddOrEditForm.controls.firstName)) {
              <span class="text-red-500">{{
                fieldErrorMessage(contactAddOrEditForm.controls.firstName)
              }}</span>
              }
            </div>
            <div class="flex flex-col gap-2 mt-2">
              <label for="">Last Name</label>
              <input
                type="text"
                hlmInput
                class="h-8 px-3 py-2"
                formControlName="lastName"
              />
              @if(fieldHasError(contactAddOrEditForm.controls.lastName)) {
              <span class="text-red-500">{{
                fieldErrorMessage(contactAddOrEditForm.controls.lastName)
              }}</span>
              }
            </div>
            <div class="flex flex-col gap-2 mt-2">
              <label for="">Email</label>
              <input
                type="text"
                hlmInput
                class="h-8 px-3 py-2"
                formControlName="email"
              />
              @if(fieldHasError(contactAddOrEditForm.controls.email)) {
              <span class="text-red-500">{{
                fieldErrorMessage(contactAddOrEditForm.controls.email)
              }}</span>
              }
            </div>
            <div class="flex flex-col gap-2 mt-2">
              <label for="">Mobile</label>
              <input
                type="text"
                hlmInput
                class="h-8 px-3 py-2"
                formControlName="mobile"
              />
              @if(fieldHasError(contactAddOrEditForm.controls.mobile)) {
              <span class="text-red-500">{{
                fieldErrorMessage(contactAddOrEditForm.controls.mobile)
              }}</span>
              }
            </div>
            <div class="flex flex-col gap-2 mt-2">
              <label for="">Address</label>
              <input
                type="text"
                hlmInput
                class="h-8 px-3 py-2"
                formControlName="address"
              />
              @if(fieldHasError(contactAddOrEditForm.controls.address)) {
              <span class="text-red-500">{{
                fieldErrorMessage(contactAddOrEditForm.controls.address)
              }}</span>
              }
            </div>
            <button
              type="submit"
              class="w-full h-8 px-3 py-2 mt-5"
              hlmBtn
              [disabled]="
                contactAddOrEditForm.invalid ||
                !contactAddOrEditForm.dirty ||
                isLoading()
              "
            >
              {{ contactAddOrEditForm.value.id === 0 ? 'Add' : 'Save' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class AddOrEditContactComponent {
  @ViewChild('modalWrapper') modalWrapper!: ElementRef;
  private route = inject(ActivatedRoute);
  private contactService = inject(ContactService);
  private formBuilder = inject(FormBuilder);
  private destroyed$ = new Subject<void>();
  @Input() contactAddOrEditForm!: FormGroup<{
    id: FormControl<number>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    mobile: FormControl<string>;
    address: FormControl<string>;
    status: FormControl<string>;
  }>;
  @Output() handleSubmit = new EventEmitter<void>();
  isLoading = signal(false);

  // public contactAddOrEditForm = this.formBuilder.group({
  //   id: this.formBuilder.nonNullable.control(0),
  //   firstName: this.formBuilder.nonNullable.control('', [
  //     Validators.required,
  //     Validators.minLength(3),
  //     Validators.maxLength(50),
  //   ]),
  //   lastName: this.formBuilder.nonNullable.control('', [
  //     Validators.required,
  //     Validators.minLength(3),
  //     Validators.maxLength(50),
  //   ]),
  //   email: this.formBuilder.nonNullable.control('', [
  //     Validators.required,
  //     Validators.email,
  //   ]),
  //   mobile: this.formBuilder.nonNullable.control('', [
  //     Validators.required,
  //     Validators.pattern(/^[0-9]{11}$/),
  //   ]),
  //   address: this.formBuilder.nonNullable.control('', [
  //     Validators.required,
  //     Validators.minLength(3),
  //     Validators.maxLength(100),
  //   ]),
  //   status: this.formBuilder.nonNullable.control('ACTIVE'),
  // });

  openModal() {
    const modalWrapper = this.modalWrapper.nativeElement;
    modalWrapper.classList.add('opacity-100');
    modalWrapper.classList.remove('opacity-0', 'pointer-events-none');
    console.log('openModal');
    // console.log(contactId);
    // if (contactId !== undefined) {
    //   console.log('contactId is not undefined');
    //   this.contactService
    //     .getContact(contactId!)
    //     .pipe(takeUntil(this.destroyed$))
    //     .subscribe({
    //       next: (contact) => {
    //         this.contactAddOrEditForm.patchValue({
    //           id: contact.contactId,
    //           firstName: contact.contactFirstName,
    //           lastName: contact.contactLastName,
    //           email: contact.contactEmail,
    //           mobile: contact.contactMobileNumber,
    //           address: contact.contactAddress,
    //           status: contact.contactStatus,
    //         });
    //         console.log(contact);
    //       },
    //     });
    // }
  }

  closeModal() {
    const modalWrapper = this.modalWrapper.nativeElement;
    modalWrapper.classList.add('opacity-0', 'pointer-events-none');
    modalWrapper.classList.remove('opacity-100');
    console.log('closeModal');
    console.log(this.contactAddOrEditForm.value.id);
    this.contactAddOrEditForm.reset();
  }

  // Prevent clicks inside the modal from closing it
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  ngOnInit() {
    console.log('AddOrEditContactComponent ngOnInit');
  }

  // handleSubmit() {
  //   if (this.contactAddOrEditForm.invalid) {
  //     return;
  //   }

  //   console.log('submit');
  //   console.log(this.contactAddOrEditForm.value);

  //   this.isLoading.set(true);
  //   if (this.contactAddOrEditForm.value.id === 0) {
  //     this.contactService
  //       .addContact({
  //         contactId: 0,
  //         contactFirstName: this.contactAddOrEditForm.value.firstName!,
  //         contactLastName: this.contactAddOrEditForm.value.lastName!,
  //         contactEmail: this.contactAddOrEditForm.value.email!,
  //         contactMobileNumber: this.contactAddOrEditForm.value.mobile!,
  //         contactAddress: this.contactAddOrEditForm.value.address!,
  //         contactStatus: this.contactAddOrEditForm.value.status!,
  //       })
  //       .pipe(takeUntil(this.destroyed$))
  //       .subscribe({
  //         next: (value) => {
  //           console.log(value);
  //           this.isLoading.set(false);
  //           this.closeModal();
  //         },
  //         error: (err) => {
  //           console.log(err);
  //           this.isLoading.set(false);
  //         },
  //       });
  //     return;
  //   }

  //   this.contactService
  //     .updateContact({
  //       contactId: this.contactAddOrEditForm.value.id!,
  //       contactFirstName: this.contactAddOrEditForm.value.firstName!,
  //       contactLastName: this.contactAddOrEditForm.value.lastName!,
  //       contactEmail: this.contactAddOrEditForm.value.email!,
  //       contactMobileNumber: this.contactAddOrEditForm.value.mobile!,
  //       contactAddress: this.contactAddOrEditForm.value.address!,
  //       contactStatus: this.contactAddOrEditForm.value.status!,
  //     })
  //     .pipe(takeUntil(this.destroyed$))
  //     .subscribe({
  //       next: (value) => {
  //         console.log(value);
  //         this.isLoading.set(false);
  //         this.closeModal();
  //       },
  //       error: (err) => {
  //         console.log(err);
  //         this.isLoading.set(false);
  //       },
  //     });
  // }

  // FormGroup Validators
  fieldHasError(field: FormControl): boolean {
    if (field.hasError('required') && field.touched) return true;
    if (field.hasError('minlength') && field.touched) return true;
    if (field.hasError('maxlength') && field.touched) return true;
    if (field.hasError('email') && field.touched) return true;
    if (field.hasError('pattern') && field.touched) return true;
    return false;
  }

  fieldErrorMessage(field: FormControl): string {
    if (field.hasError('required')) return 'This field is required.';
    if (field.hasError('minlength')) return 'Minimum length is 3 characters.';
    if (field.hasError('maxlength')) return 'Maximum length is 50 characters.';
    if (field.hasError('email')) return 'Invalid email address.';
    if (field.hasError('pattern')) return 'Invalid mobile number.';
    return '';
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.contactAddOrEditForm.reset();
  }
}
