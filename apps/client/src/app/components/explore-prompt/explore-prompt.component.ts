import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiButtonLoading, TuiChip, TuiSkeleton } from '@taiga-ui/kit';
import { TuiTextareaModule } from '@taiga-ui/legacy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiCardLarge } from '@taiga-ui/layout';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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

  protected suggestionClick(suggestion: string): void {
    this.router.navigate(['/explore/charts'], {
      queryParams: { c: this.store.selectedConnectionId(), q: suggestion },
    });
  }
}
