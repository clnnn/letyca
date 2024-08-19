import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingState } from '../../utils';
import { TuiDataListWrapper, TuiStringifyContentPipe } from '@taiga-ui/kit';
import { TuiDataList } from '@taiga-ui/core';
import { TuiComboBoxModule } from '@taiga-ui/legacy';
import { Connection } from '../../state';

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
  connections!: Connection[];

  @Input({ required: true })
  connectionsLoading!: LoadingState;

  @Output()
  readonly connectionChange = new EventEmitter<Connection>();

  connectionDropdown = new FormControl<Connection | undefined>(undefined);

  readonly stringify = (item: Connection): string =>
    `${item.host}:${item.port} - ${item.database}`;

  onChanges(selected?: Connection): void {
    this.connectionChange.emit(selected);
  }
}
