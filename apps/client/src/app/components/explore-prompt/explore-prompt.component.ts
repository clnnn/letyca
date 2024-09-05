import {
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TuiButton, TuiDialogContext, TuiHint, TuiTitle } from '@taiga-ui/core';
import {
  TuiButtonLoading,
  TuiChip,
  TuiPreview,
  TuiPreviewDialogService,
  TuiSkeleton,
} from '@taiga-ui/kit';
import { TuiTextareaModule } from '@taiga-ui/legacy';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '../../state';

const tuiImports = [
  TuiTextareaModule,
  TuiButton,
  TuiButtonLoading,
  TuiChip,
  TuiSkeleton,
  TuiTitle,
  TuiHint,
  TuiPreview,
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
  protected readonly store = inject(Store);
  private readonly previewDialogService = inject(TuiPreviewDialogService);

  @ViewChild('preview')
  protected readonly preview?: TemplateRef<TuiDialogContext>;

  protected showSchemaPreview(): void {
    this.previewDialogService.open(this.preview ?? '').subscribe();
  }

  submitByEnter(event: Event): void {
    event.preventDefault();
    if (this.store.userRequest().length === 0) {
      return;
    }

    if (this.store.selectedConnectionId() === null) {
      return;
    }

    if (this.store.suggestionsLoading() === 'LOADING') {
      return;
    }

    if (this.store.previewChartLoading() === 'LOADING') {
      return;
    }

    this.store.generateChart();
  }
}
