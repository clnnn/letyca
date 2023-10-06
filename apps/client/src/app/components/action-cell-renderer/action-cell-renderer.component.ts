import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ConnectionFacade } from '../../facade/connection.facade';

@Component({
  selector: 'le-action-cell-renderer',
  templateUrl: './action-cell-renderer.component.html',
  styleUrls: ['./action-cell-renderer.component.scss'],
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  connectionId?: string;

  constructor(private facade: ConnectionFacade) {}

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
