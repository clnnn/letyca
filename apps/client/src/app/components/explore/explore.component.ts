import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '../../state';
import { ExploreHeaderComponent } from '../explore-header/explore-header.component';
import { ExplorePromptComponent } from '../explore-prompt/explore-prompt.component';

@Component({
  selector: 'le-explore',
  standalone: true,
  imports: [ExploreHeaderComponent, ExplorePromptComponent],
  template: `
    <le-explore-header title="Explore" />
    <le-explore-prompt />
  `,
  styles: `
  :host {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreComponent implements OnInit {
  readonly store = inject(Store);

  ngOnInit(): void {
    this.store.loadConnections();
  }
}
