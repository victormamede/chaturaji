export function max<T>(
  array: T[],
  pred: (item: T) => number
): [T | null, number] {
  let maxItem: T | null = null;
  let maxValue = -Infinity;

  for (const item of array) {
    const currentValue = pred(item);
    if (currentValue > maxValue) {
      maxValue = currentValue;
      maxItem = item;
    }
  }

  return [maxItem, maxValue];
}

export function min<T>(
  array: T[],
  pred: (item: T) => number
): [T | null, number] {
  let minItem: T | null = null;
  let minValue = Infinity;

  for (const item of array) {
    const currentValue = pred(item);
    if (currentValue < minValue) {
      minValue = currentValue;
      minItem = item;
    }
  }

  return [minItem, minValue];
}
