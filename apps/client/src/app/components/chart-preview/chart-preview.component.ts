import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'le-chart-preview',
  standalone: true,
  imports: [],
  templateUrl: './chart-preview.component.html',
  styleUrls: ['./chart-preview.component.scss'],
})
export class ChartPreviewComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly userRequest$ = this.route.queryParamMap.pipe(
    map((params) => params.get('q')),
  );

  ngOnInit(): void {}
}
