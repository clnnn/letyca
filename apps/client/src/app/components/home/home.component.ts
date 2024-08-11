import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'le-home',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <span class="tui-text_h1">{{ t$ | async }}</span>
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
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  `,
})
export class HomeComponent implements OnInit {
  titles = [
    `Hi. I'm Letyca, your Analytical Copilot`,
    'I am here to help you make sense of your data',
    'I can help you with data analysis, visualization, and more',
    'I am a proof of concept, so please be patient with me',
  ];

  t$ = this.getTypewriterEffect(this.titles);

  constructor() {}

  ngOnInit(): void {
    // Initialization code goes here
  }

  private type({ word, speed, backwards = false }: TypeParams) {
    return interval(speed).pipe(
      map((x) =>
        backwards
          ? word.substring(0, word.length - x)
          : word.substring(0, x + 1)
      ),
      take(word.length)
    );
  }

  typeEffect(word: string) {
    return concat(
      this.type({ word, speed: 40 }),
      of('').pipe(delay(1200), ignoreElements()),
      this.type({ word, speed: 25, backwards: true }),
      of('').pipe(delay(300), ignoreElements())
    );
  }

  getTypewriterEffect(titles: string[]) {
    return from(titles).pipe(
      concatMap((title) => this.typeEffect(title)),
      repeat()
    );
  }
}

type TypeParams = {
  word: string;
  speed: number;
  backwards?: boolean;
};
