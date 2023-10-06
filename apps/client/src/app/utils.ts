export function nameOf<T>(name: keyof T): keyof T {
  return name;
}
