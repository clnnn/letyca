import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import { TuiDataListModule } from '@taiga-ui/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectionListItem } from '@letyca/contracts';
import { TuiValueChangesModule } from '@taiga-ui/cdk';
import { LoadingState } from '../../utils';

@Component({
  selector: 'le-charts-page-header',
  standalone: true,
  imports: [
    CommonModule,
    TuiComboBoxModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    FormsModule,
    ReactiveFormsModule,
    TuiStringifyContentPipeModule,
    TuiValueChangesModule,
  ],
  templateUrl: './charts-page-header.component.html',
  styleUrls: ['./charts-page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsPageHeaderComponent {
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
