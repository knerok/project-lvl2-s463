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

test('third test', () => {
  const result = fs.readFileSync('__tests__/__fixtures__/result3.txt', 'utf-8');
  expect(genDiff('__tests__/__fixtures__/before.ini',
    '__tests__/__fixtures__/after.ini'))
    .toBe(result);
});

const arr = [
  ['__tests__/__fixtures__/before.json',
    '__tests__/__fixtures__/after.json',
    '__tests__/__fixtures__/result1.txt'],
  ['__tests__/__fixtures__/before.yml',
    '__tests__/__fixtures__/after.yml',
    '__tests__/__fixtures__/result2.txt'],
  ['__tests__/__fixtures__/before.ini',
    '__tests__/__fixtures__/after.ini',
    '__tests__/__fixtures__/result3.txt']];

test.each(arr)(
  'fourth test',
  (filepath1, filepath2, resultpath) => {
    const result = fs.readFileSync(resultpath, 'utf-8');
    expect(genDiff(filepath1, filepath2)).toBe(result);
  },
);
