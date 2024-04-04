export const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
};

export const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b);
};
