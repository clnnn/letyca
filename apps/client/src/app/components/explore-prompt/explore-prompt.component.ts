import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  output,
} from '@angular/core';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiButtonLoading, TuiChip, TuiSkeleton } from '@taiga-ui/kit';
import { TuiTextareaModule } from '@taiga-ui/legacy';
import { LoadingState } from '../../utils';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiCardLarge } from '@taiga-ui/layout';

const tuiImports = [
  TuiTextareaModule,
  TuiButton,
  TuiButtonLoading,
  TuiChip,
  TuiSkeleton,
  TuiCardLarge,
  TuiTitle,
];

@Component({
  selector: 'le-explore-prompt',
  standalone: true,
  imports: [...tuiImports, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './explore-prompt.component.html',
  styleUrls: ['./explore-prompt.component.scss'],
})
export class ExplorePromptComponent {
  private readonly fb = inject(FormBuilder);
  protected userRequest = '';

  @Input({ required: true })
  chartLoading: LoadingState = LoadingState.INIT;

  @Input({ required: true })
  connectionSelected!: boolean;

  @Input({ required: true })
  suggestions: string[] = [];

  @Input({ required: true })
  suggestionsLoading: LoadingState = LoadingState.INIT;

  readonly submitUserRequest = output<string>();
}
