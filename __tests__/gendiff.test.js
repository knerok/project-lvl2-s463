import fs from 'fs';
import genDiff from '../src';

test('first test', () => {
  const result = fs.readFileSync('__tests__/__fixtures__/result1.txt', 'utf-8');
  expect(genDiff('/home/andrey/Desktop/pr2/__tests__/__fixtures__/before.json',
    '__tests__/__fixtures__/after.json'))
    .toBe(result);
});
