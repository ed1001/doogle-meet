const greatestCommonDivisor = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }
  return greatestCommonDivisor(b, a % b);
};

export const leastCommonMultiple = (a: number, b: number): number => {
  return (a * b) / greatestCommonDivisor(a, b);
};
