import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectionListItem } from '@letyca/contracts';
import { LoadingState } from '../../utils';
import { TuiDataListWrapper, TuiStringifyContentPipe } from '@taiga-ui/kit';
import { TuiDataList } from '@taiga-ui/core';
import { TuiComboBoxModule } from '@taiga-ui/legacy';

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
  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  connections!: ConnectionListItem[];

  @Input({ required: true })
  connectionsLoading!: LoadingState;

  @Output()
  readonly connectionChange = new EventEmitter<ConnectionListItem>();

  connectionDropdown = new FormControl<ConnectionListItem | undefined>(
    undefined
  );

  readonly stringify = (item: ConnectionListItem): string =>
    `${item.host}:${item.port} - ${item.database}`;

  onChanges(selected?: ConnectionListItem): void {
    this.connectionChange.emit(selected);
  }
}
