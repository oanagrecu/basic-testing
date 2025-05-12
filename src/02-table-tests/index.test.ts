import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },

  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 10, b: 5, action: Action.Subtract, expected: 5 },
  { a: 7, b: 2, action: Action.Subtract, expected: 5 },

  { a: 2, b: 3, action: Action.Multiply, expected: 6 },
  { a: 4, b: 3, action: Action.Multiply, expected: 12 },
  { a: 5, b: 2, action: Action.Multiply, expected: 10 },

  { a: 6, b: 2, action: Action.Divide, expected: 3 },
  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 9, b: 3, action: Action.Divide, expected: 3 },

  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
  { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should correctly perform $action on $a and $b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
