import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TuiBlockStatus } from '@taiga-ui/layout';
import { combineLatest, filter, map, switchMap } from 'rxjs';
import { TypeWritterSerivce } from '../../service/typewriter.service';
import { AsyncPipe } from '@angular/common';
import { Store } from '../../state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChartGenerationLoadingComponent } from '../chart-generation-loading/chart-generation-loading.component';
import { ChartGenerationErrorComponent } from '../chart-generation-error/chart-generation-error.component';

const tuiImports = [TuiBlockStatus];

@Component({
  selector: 'le-chart-preview',
  standalone: true,
  imports: [
    ...tuiImports,
    AsyncPipe,
    ChartGenerationLoadingComponent,
    ChartGenerationErrorComponent,
  ],
  templateUrl: './chart-preview.component.html',
  styleUrls: ['./chart-preview.component.scss'],
})
export class ChartPreviewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly typeWritter = inject(TypeWritterSerivce);
  protected readonly store = inject(Store);

  private readonly userRequestParam$ = this.route.queryParamMap.pipe(
    map((params) => params.get('q')),
  );
  private readonly connectionIdParam$ = this.route.queryParamMap.pipe(
    map((params) => params.get('c')),
  );

  protected readonly typeWrittenUserRequest$ = this.userRequestParam$.pipe(
    filter((text): text is string => text !== null),
    filter((text) => text.length > 0),
    map((text) => text.trim()),
    map((text) => text[0].toLocaleUpperCase() + text.slice(1)),
    switchMap((text) => this.typeWritter.type({ text, speed: 30 })),
  );

  ngOnInit(): void {
    combineLatest([this.connectionIdParam$, this.userRequestParam$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([connectionId, userRequest]) => {
        if (connectionId !== null && userRequest !== null) {
          this.store.generateChart({ connectionId, userRequest });
        }
      });
  }
}
