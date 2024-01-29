import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightJsDirective} from 'ngx-highlight-js';
import { ChartFacade } from '../../facade/chart.facade';

@Component({
  selector: 'le-chart-sql-viewer',
  standalone: true,
  imports: [CommonModule, HighlightJsDirective],
  templateUrl: './chart-sql-viewer.component.html',
  styleUrls: ['./chart-sql-viewer.component.scss'],
})
export class ChartSqlViewerComponent {

  sql = this.facade.sql;

  constructor(private facade: ChartFacade) {}
}
