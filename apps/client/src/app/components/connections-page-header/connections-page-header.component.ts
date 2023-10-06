import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'le-connections-page-header',
  templateUrl: './connections-page-header.component.html',
  styleUrls: ['./connections-page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionsPageHeaderComponent {
  @Input()
  title?: string;

  @Output()
  readonly addNewConnection = new EventEmitter<void>();

  clickAddNew() {
    this.addNewConnection.emit();
  }
}
