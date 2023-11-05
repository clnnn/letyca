export function nameOf<T>(name: keyof T): keyof T {
  return name;
}

export enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR',
}
