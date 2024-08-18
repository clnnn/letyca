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
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

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
  imports: [
    ...tuiImports,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './explore-prompt.component.html',
  styleUrls: ['./explore-prompt.component.scss'],
})
export class ExplorePromptComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected userRequest = '';

  @Input({ required: true })
  connectionId!: string | null;

  @Input({ required: true })
  suggestions: string[] = [];

  @Input({ required: true })
  suggestionsLoading: LoadingState = LoadingState.INIT;

  protected suggestionClick(suggestion: string): void {
    this.router.navigate(['/explore/charts'], {
      queryParams: { c: this.connectionId, q: suggestion },
    });
  }
}
