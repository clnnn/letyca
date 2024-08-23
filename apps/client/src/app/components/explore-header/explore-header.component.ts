import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDataListWrapper, TuiStringifyContentPipe } from '@taiga-ui/kit';
import { TuiDataList } from '@taiga-ui/core';
import { TuiComboBoxModule } from '@taiga-ui/legacy';
import { Connection, Store } from '../../state';

const tuiImports = [
  TuiDataListWrapper,
  TuiDataList,
  TuiStringifyContentPipe,
  TuiComboBoxModule, // TODO: Should be replaced later on
];

@Component({
  selector: 'le-explore-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...tuiImports],
  templateUrl: './explore-header.component.html',
  styleUrls: ['./explore-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreHeaderComponent {
  readonly store = inject(Store);

  @Input({ required: true })
  title!: string;

  connectionDropdown = new FormControl<Connection | undefined>(undefined);

  readonly stringify = (item: Connection): string =>
    `${item.host}:${item.port} - ${item.database}`;

  constructor() {
    effect(() => {
      const selectedConnection = this.store.selectedConnection();
      if (selectedConnection) {
        this.connectionDropdown.setValue(selectedConnection);
      }
    });
  }

  onChanges(selected?: Connection): void {
    if (!selected) {
      return;
    }

    this.store.selectConnection(selected.id);
  }
}
