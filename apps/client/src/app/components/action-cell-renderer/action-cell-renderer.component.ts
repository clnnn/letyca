import { Component, inject } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ConnectionFacade } from '../../facade/connection.facade';
import { TuiButtonModule } from '@taiga-ui/core/components/button';

@Component({
  selector: 'le-action-cell-renderer',
  templateUrl: './action-cell-renderer.component.html',
  styleUrls: ['./action-cell-renderer.component.scss'],
  standalone: true,
  imports: [TuiButtonModule],
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  private readonly facade = inject(ConnectionFacade);

  private connectionId?: string;

  agInit(params: ICellRendererParams): void {
    this.connectionId = params.node.id;
  }

  refresh(): boolean {
    return true;
  }

  remove(): void {
    this.facade.delete(this.connectionId ?? '');
  }
}
