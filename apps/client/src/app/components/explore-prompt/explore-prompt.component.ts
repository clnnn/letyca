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
import { Store } from '../../state';

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
  private readonly router = inject(Router);
  protected readonly store = inject(Store);
  protected userRequest = '';
  protected readonly connectionId = this.store.selectedConnectionId();

  protected suggestionClick(suggestion: string): void {
    this.router.navigate(['/explore/charts'], {
      queryParams: { c: this.connectionId, q: suggestion },
    });
  }
}
