import { Injectable } from '@angular/core';
import { interval, map, take } from 'rxjs';

type TypeParams = {
  text: string;
  speed: number;
  backwards?: boolean;
};

@Injectable()
export class TypeWritterSerivce {
  type({ text, speed, backwards = false }: TypeParams) {
    return interval(speed).pipe(
      map((x) =>
        backwards
          ? text.substring(0, text.length - x)
          : text.substring(0, x + 1),
      ),
      take(text.length),
    );
  }
}
