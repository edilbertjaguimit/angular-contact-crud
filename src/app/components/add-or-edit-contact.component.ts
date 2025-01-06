import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  Input,
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
import { Subject } from 'rxjs';

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
            <span class="text-black">{{ isInvalid() }}</span>
            <h2 class="text-xl">Add Contact</h2>
            <button
              type="button"
              class="h-8 px-3 py-2"
              hlmBtn
              (click)="closeModal()"
            >
              Close
            </button>
          </div>
          <form [formGroup]="contactAddOrEditForm" (ngSubmit)="handleSubmit()">
            <div class="flex flex-col gap-2 mt-2">
              <label for="">First Name</label>
              <input
                type="text"
                hlmInput
                class="h-8 px-3 py-2"
                formControlName="firstName"
              />
              @if(fieldHasError(contactAddOrEditForm.controls.firstName,
              isInvalid())) {
              <span class="text-red-500">{{
                fieldErrorMessage(
                  contactAddOrEditForm.controls.firstName,
                  isInvalid()
                )
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
              @if(fieldHasError(contactAddOrEditForm.controls.lastName,isInvalid()))
              {
              <span class="text-red-500">{{
                fieldErrorMessage(
                  contactAddOrEditForm.controls.lastName,
                  isInvalid()
                )
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
              @if(fieldHasError(contactAddOrEditForm.controls.email,isInvalid()))
              {
              <span class="text-red-500">{{
                fieldErrorMessage(
                  contactAddOrEditForm.controls.email,
                  isInvalid()
                )
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
              @if(fieldHasError(contactAddOrEditForm.controls.mobile,isInvalid()))
              {
              <span class="text-red-500">{{
                fieldErrorMessage(
                  contactAddOrEditForm.controls.mobile,
                  isInvalid()
                )
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
              @if(fieldHasError(contactAddOrEditForm.controls.address,
              isInvalid())) {
              <span class="text-red-500">{{
                fieldErrorMessage(
                  contactAddOrEditForm.controls.address,
                  isInvalid()
                )
              }}</span>
              }
            </div>
            <button type="submit" class="w-full h-8 px-3 py-2 mt-5" hlmBtn>
              Submit
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
  // contact1 = input.required<Contact | null | undefined>();
  private route = inject(ActivatedRoute);
  private contactService = inject(ContactService);
  private formBuilder = inject(FormBuilder);
  private destroyed$ = new Subject<void>();
  isInvalidSignal = signal<boolean>(false);
  isInvalid = computed(() => this.isInvalidSignal());

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
      Validators.pattern(/^[0-9]{10}$/),
    ]),
    address: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
  });

  openModal() {
    const modalWrapper = this.modalWrapper.nativeElement;
    modalWrapper.classList.add('opacity-100');
    modalWrapper.classList.remove('opacity-0', 'pointer-events-none');
  }

  closeModal() {
    const modalWrapper = this.modalWrapper.nativeElement;
    modalWrapper.classList.add('opacity-0', 'pointer-events-none');
    modalWrapper.classList.remove('opacity-100');
  }

  // Prevent clicks inside the modal from closing it
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  handleSubmit() {
    if (this.contactAddOrEditForm.invalid) {
      this.isInvalidSignal.set(true);
      return;
    }
    this.isInvalidSignal.set(false);
    console.log('submit');
    // this.contactService.addContact(this.contactAddOrEditForm.value as Contact);
  }

  // FormGroup Validators
  fieldHasError(field: FormControl, isInvalid: boolean): boolean {
    if ((field.hasError('required') && field.touched) || isInvalid) return true;
    if (field.hasError('minlength') && field.touched) return true;
    if (field.hasError('maxlength') && field.touched) return true;
    if (field.hasError('email') && field.touched) return true;
    if (field.hasError('pattern') && field.touched) return true;
    return false;
  }

  fieldErrorMessage(field: FormControl, isInvalid: boolean): string {
    if (field.hasError('required') || isInvalid)
      return 'This field is required.';
    if (field.hasError('minlength')) return 'Minimum length is 3 characters.';
    if (field.hasError('maxlength')) return 'Maximum length is 50 characters.';
    if (field.hasError('email')) return 'Invalid email address.';
    if (field.hasError('pattern')) return 'Invalid mobile number.';
    return '';
  }
}
