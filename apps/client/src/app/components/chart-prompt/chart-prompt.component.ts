import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  inject,
} from '@angular/core';
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
import { TuiButtonModule } from '@taiga-ui/core';
import { LoadingState } from '../../utils';

@Component({
  selector: 'le-chart-prompt',
  standalone: true,
  imports: [
    CommonModule,
    TuiBlockStatusModule,
    FormsModule,
    ReactiveFormsModule,
    TuiTextareaModule,
    TuiButtonModule,
  ],
  templateUrl: './chart-prompt.component.html',
  styleUrls: ['./chart-prompt.component.scss'],
})
export class ChartPromptComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true })
  chartLoading?: LoadingState;

  @Output()
  readonly humanQuerySubmit = new EventEmitter<string>();

  form = this.fb.group({
    humanQuery: this.fb.control<string>('', Validators.required),
  });

  ngOnChanges(): void {
    const humanQueryControl = this.form.controls.humanQuery;
    if (this.chartLoading === LoadingState.LOADING) {
      humanQueryControl.disable();
    } else {
      humanQueryControl.enable();
    }
  }

  submit(): void {
    const humanQuery = this.form.controls.humanQuery.value;
    if (!humanQuery) {
      return;
    }
    this.humanQuerySubmit.emit(humanQuery);
  }
}
