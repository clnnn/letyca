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
  TuiDialogContext,
  TuiDialogModule,
  TuiDialogService,
  TuiLabelModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { LoadingState } from '../../utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';

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
    TuiDialogModule,
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

  // DEMO only - to be removed in production
  @Input({ required: true })
  demoMode!: boolean;

  readonly demoExamples: { query: string }[] = [
    {
      query: 'Total number of products',
    },
    {
      query:
        'Please display the number of total products by types in a pie chart',
    },
    {
      query:
        'Number of products with price below 10 and products with price over 10 in a pie chart',
    },
    {
      query: 'Represent monthly sales for year 1997 using a line chart',
    },
    {
      query: 'Average age of employees per country',
    },
    {
      query: 'Top 5 customers by revenue',
    },
    {
      query:
        'I want to display products by price in a bar chart, sorted in a descending order from the expensive to the cheapest product',
    },
  ];

  private readonly dialogService = inject(TuiDialogService);
  //

  form = this.fb.group({
    humanQuery: this.fb.control<string>('', Validators.required),
  });

  exampleQuery = this.fb.control<{ query: string } | null>(null);

  readonly stringifyExamples = (example: { query: string }): string =>
    `${example.query}`;

  ngOnInit(): void {
    this.exampleQuery.valueChanges
      .pipe(
        map((value) => value?.query ?? ''),
        takeUntilDestroyed(this.destroy)
      )
      .subscribe((value) => this.form.controls.humanQuery.setValue(value));
  }

  ngOnChanges(): void {
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

  openDiagram(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService
      .open(content, { size: 'auto' })
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe();
  }
}
