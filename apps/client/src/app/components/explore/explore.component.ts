import { Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '../../state';
import { ExploreHeaderComponent } from '../explore-header/explore-header.component';
import { ExplorePromptComponent } from '../explore-prompt/explore-prompt.component';

@Component({
  selector: 'le-explore',
  standalone: true,
  imports: [ExploreHeaderComponent, ExplorePromptComponent],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  readonly store = inject(Store);
  readonly selectedConnectionId = signal<string | null>(null);

  ngOnInit(): void {
    this.store.loadConnections();
  }

  selectConnection(connectionId?: string): void {
    if (!connectionId) {
      return;
    }

    this.selectedConnectionId.set(connectionId);
    this.store.loadSuggestions(connectionId);
  }
}
