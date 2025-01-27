import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [HlmButtonDirective],
  template: `
    <div
      class="absolute z-50 top-0 left-0 w-full h-screen bg-slate-950 bg-opacity-50 text-white opacity-0 pointer-events-none transition-all duration-300"
      #modalWrapper
    >
      <div class="flex items-center justify-center h-full">
        <div
          class="w-96 text-slate-950 bg-slate-50 p-5 rounded-md shadow-2xl"
          (click)="stopPropagation($event)"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-xl">
              {{ title }}
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
          <div class="mt-5">
            {{ body }}
          </div>
          <div class="mt-5 flex justify-end">
            <button
              type="button"
              class="h-8 px-3 py-2 bg-red-500 text-white hover:bg-red-600"
              hlmBtn
              (click)="deleteClick.emit()"
              [disabled]="isLoading()"
            >
              {{ buttonTitle }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ModalComponent {
  @ViewChild('modalWrapper') modalWrapper!: ElementRef;
  @Input() title: any;
  @Input() body: any;
  @Input() buttonTitle: any;
  @Output() deleteClick = new EventEmitter();
  @Output() isLoading = signal(false);

  // Prevent clicks inside the modal from closing it
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  closeModal() {
    const modalWrapper = this.modalWrapper.nativeElement;
    modalWrapper.classList.add('opacity-0', 'pointer-events-none');
    modalWrapper.classList.remove('opacity-100');
  }

  openModal() {
    const modalWrapper = this.modalWrapper.nativeElement;
    modalWrapper.classList.remove('opacity-0', 'pointer-events-none');
    modalWrapper.classList.add('opacity-100');
  }
}
