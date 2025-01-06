import { Component } from '@angular/core';
import { HlmFormFieldComponent } from '../../../libs/ui/ui-formfield-helm/src/lib/hlm-form-field.component';
import { HlmHintDirective } from '../../../libs/ui/ui-formfield-helm/src/lib/hlm-hint.directive';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmInputDirective,
    HlmFormFieldComponent,
    HlmHintDirective,
  ],
  template: `
    <div>
      <h1 class="text-3xl font-bold">Home</h1>
    </div>
    <input type="button" hlmBtn value="hello" />
    <hlm-form-field>
      <input class="w-80" hlmInput type="email" placeholder="Email" />
      <hlm-hint>This is your email address.</hlm-hint>
    </hlm-form-field>
  `,
  styles: ``,
})
export class HomeComponent {}
