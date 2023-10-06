import { ColDef, GetRowIdFunc, GetRowIdParams } from 'ag-grid-community';

import { ActionCellRendererComponent } from '../action-cell-renderer/action-cell-renderer.component';
import { nameOf } from '../../utils';
import { ConnectionListItem } from '@letyca/contracts';

type ConnectionsGridConfiguration = {
  theme: string;
  columnDefs: ColDef[];
  animatedRows: boolean;
  getRowId: GetRowIdFunc;
};

export const configuration: ConnectionsGridConfiguration = {
  theme: 'ag-theme-alpine',
  columnDefs: [
    {
      field: nameOf<ConnectionListItem>('id'),
      hide: true,
    },
    {
      field: nameOf<ConnectionListItem>('host'),
    },
    {
      field: nameOf<ConnectionListItem>('port'),
    },
    {
      field: nameOf<ConnectionListItem>('database'),
    },
    {
      field: nameOf<ConnectionListItem>('schema'),
    },
    {
      field: 'action',
      cellRenderer: ActionCellRendererComponent,
      headerName: '',
      width: 100,
    },
  ],
  animatedRows: true,
  getRowId: (params: GetRowIdParams<ConnectionListItem>) => params.data.id,
};
