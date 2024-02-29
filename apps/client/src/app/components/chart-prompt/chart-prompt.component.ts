import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiBlockStatusModule } from '@taiga-ui/layout';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiStringifyContentPipeModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { LoadingState } from '../../utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

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
    TuiDataListWrapperModule,
    TuiStringifyContentPipeModule,
    TuiComboBoxModule,
    TuiLabelModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './chart-prompt.component.html',
  styleUrls: ['./chart-prompt.component.scss'],
})
export class ChartPromptComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly destroy = inject(DestroyRef);

  @Input({ required: true })
  chartLoading?: LoadingState;

  @Output()
  readonly humanQuerySubmit = new EventEmitter<string>();

  @Input({ required: true })
  demoMode!: boolean;

  readonly demoExamples: { name: string; query: string }[] = [
    {
      name: 'Total number of products',
      query: 'Total number of products',
    },
    {
      name: 'Total number of products by type',
      query:
        'Please display the number of total products by types in a pie chart',
    },
    {
      name: 'Filter products by price',
      query:
        'Number of products with price below 10 and products with price over 10 in a pie chart',
    },
    {
      name: 'Monthly sales',
      query: 'Represent monthly sales for year 1997 using a line chart',
    },
    {
      name: 'Daily Cumulative sales',
      query: 'cumulative revenue for December 1996 on daily basis',
    },
    {
      name: 'Employees average age',
      query: 'verage age of employees per country',
    },
    {
      name: 'Top 5 customers',
      query: 'Top 5 customers by revenue',
    },
    {
      name: 'Products sorted by price',
      query: 'from most expensive to most cheapest product, in a bar chart',
    },
  ];

  form = this.fb.group({
    humanQuery: this.fb.control<string>('', Validators.required),
    exampleQuery: this.fb.control<{ name: string; query: string } | null>(null),
  });

  readonly stringifyExamples = (example: { name: string }): string =>
    `${example.name}`;

  ngOnInit(): void {
    this.form.controls.exampleQuery.valueChanges
      .pipe(
        map((value) => value?.query ?? ''),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe((value) => this.form.controls.humanQuery.setValue(value));
  }

  ngOnChanges(): void {
    this.form.controls.exampleQuery;
    if (this.chartLoading === LoadingState.LOADING) {
      this.form.disable();
    } else {
      this.form.enable();
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
