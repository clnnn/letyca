import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionListItem } from '@letyca/contracts';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiTextareaModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';

@Component({
  selector: 'le-chart-preview',
  standalone: true,
  imports: [
    CommonModule,
    TuiBlockStatusModule,
    FormsModule,
    ReactiveFormsModule,
    TuiTextareaModule,
    TuiButtonModule,
  ],
  templateUrl: './chart-preview.component.html',
  styleUrls: ['./chart-preview.component.scss'],
})
export class ChartPreviewComponent {
  private readonly fb = inject(FormBuilder);

  @Input()
  selectedConnection?: ConnectionListItem;

  @Output()
  readonly messageSubmit = new EventEmitter<string>();

  form = this.fb.group({
    message: this.fb.control<string>('', Validators.required),
  });

  submit(): void {
    const message = this.form.controls.message.value;
    if (!message) {
      return;
    }
    this.messageSubmit.emit(message);
  }
}
