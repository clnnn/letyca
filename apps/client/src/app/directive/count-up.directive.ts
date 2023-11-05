import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  animationFrameScheduler,
  combineLatest,
  distinctUntilChanged,
  endWith,
  interval,
  map,
  switchMap,
  takeWhile,
} from 'rxjs';

const easeOutQuad = (x: number): number => x * (2 - x);

@Directive({
  selector: '[leCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit {
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroy = inject(DestroyRef);

  @Input('leCountUp')
  set count(count: number) {
    this.count$.next(count);
  }

  @Input()
  set duration(duration: number) {
    this.duration$.next(duration);
  }

  private readonly count$ = new BehaviorSubject(0);
  private readonly duration$ = new BehaviorSubject(2000);
  private readonly currentCount$ = combineLatest([
    this.count$,
    this.duration$,
  ]).pipe(
    switchMap(([count, duration]) => {
      // get the time when animation is triggered
      const startTime = animationFrameScheduler.now();

      return interval(0, animationFrameScheduler).pipe(
        map(() => animationFrameScheduler.now() - startTime),
        map((elapsedTime) => elapsedTime / duration),
        takeWhile((progress) => progress <= 1),
        map(easeOutQuad),
        map((progress) => Math.round(progress * count)),
        endWith(count),
        distinctUntilChanged()
      );
    })
  );

  ngOnInit(): void {
    this.displayCurrentCount();
  }

  private displayCurrentCount(): void {
    this.currentCount$
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((currentCount) => {
        this.renderer.setProperty(
          this.elementRef.nativeElement,
          'innerHTML',
          currentCount
        );
      });
  }
}
