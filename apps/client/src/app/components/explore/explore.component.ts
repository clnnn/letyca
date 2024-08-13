import { Component, effect, inject, OnInit } from '@angular/core';
import { Store } from '../../state';
import { ExploreHeaderComponent } from '../explore-header/explore-header.component';

@Component({
  selector: 'le-explore',
  standalone: true,
  imports: [ExploreHeaderComponent],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  readonly store = inject(Store);

  ngOnInit(): void {
    this.store.loadConnections();
  }
}
