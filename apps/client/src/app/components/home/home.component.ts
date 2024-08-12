import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  concat,
  concatMap,
  delay,
  from,
  ignoreElements,
  interval,
  map,
  of,
  repeat,
  take,
} from 'rxjs';

type TypeParams = {
  text: string;
  speed: number;
  backwards?: boolean;
};

@Component({
  selector: 'le-home',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <span class="tui-text_h1">{{ typewriterText$ | async }}</span>
    <img
      src="/assets/images/welcome.svg"
      width="800"
      height="800"
      alt="Welcome"
    />
  `,
  styles: `
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `,
})
export class HomeComponent {
  protected readonly typewriterText$ = this.typewriterEffect([
    `Hi. I'm Letyca, your Analytical Copilot.`,
    'I am here to help you make sense of your data.',
    'I can help you with data analysis, visualization, and more.',
    'I am a proof of concept, so please be patient with me.',
  ]);

  private typewriterEffect(text: string[]) {
    return from(text).pipe(
      concatMap((text) => this.typeEffect(text)),
      repeat()
    );
  }

  private typeEffect(text: string) {
    return concat(
      this.type({ text, speed: 40 }),
      of('').pipe(delay(1200), ignoreElements()),
      this.type({ text, speed: 25, backwards: true }),
      of('').pipe(delay(300), ignoreElements())
    );
  }

  private type({ text, speed, backwards = false }: TypeParams) {
    return interval(speed).pipe(
      map((x) =>
        backwards
          ? text.substring(0, text.length - x)
          : text.substring(0, x + 1)
      ),
      take(text.length)
    );
  }
}
