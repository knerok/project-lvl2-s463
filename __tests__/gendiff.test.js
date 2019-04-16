import fs from 'fs';
import genDiff from '../src';

test('first test', () => {
  const result = fs.readFileSync('__tests__/__fixtures__/result1.txt', 'utf-8');
  expect(genDiff('__tests__/__fixtures__/before.json',
    '__tests__/__fixtures__/after.json'))
    .toBe(result);
});

test('second test', () => {
  const result = fs.readFileSync('__tests__/__fixtures__/result2.txt', 'utf-8');
  expect(genDiff('__tests__/__fixtures__/before.yml',
    '__tests__/__fixtures__/after.yml'))
    .toBe(result);
});
