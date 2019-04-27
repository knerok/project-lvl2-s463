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

const testsData = [
  ['__tests__/__fixtures__/before.json',
    '__tests__/__fixtures__/after.json',
    '__tests__/__fixtures__/result1.txt'],
  ['__tests__/__fixtures__/before.yml',
    '__tests__/__fixtures__/after.yml',
    '__tests__/__fixtures__/result2.txt'],
  ['__tests__/__fixtures__/before.ini',
    '__tests__/__fixtures__/after.ini',
    '__tests__/__fixtures__/result3.txt']];

test.each(testsData)(
  'fourth test',
  (filepath1, filepath2, resultpath) => {
    const result = fs.readFileSync(resultpath, 'utf-8');
    expect(genDiff(filepath1, filepath2)).toBe(result);
  },
);

test('fifth test', () => {
  const result = fs.readFileSync('__tests__/__fixtures__/result5.txt', 'utf-8');
  expect(genDiff('__tests__/__fixtures__/before1.json',
    '__tests__/__fixtures__/after1.json'))
    .toBe(result);
});

test('sixth test', () => {
  const result = fs.readFileSync('__tests__/__fixtures__/result6.txt', 'utf-8');
  expect(genDiff('__tests__/__fixtures__/before1.json',
    '__tests__/__fixtures__/after1.json', 'plain'))
    .toBe(result);
});

test('seventh test', () => {
  const result = fs.readFileSync('__tests__/__fixtures__/result7.txt', 'utf-8');
  expect(genDiff('__tests__/__fixtures__/before.json',
    '__tests__/__fixtures__/after.json', 'json'))
    .toBe(result);
});

test('eight test', () => {
  const result = fs.readFileSync('__tests__/__fixtures__/result8.txt', 'utf-8');
  expect(genDiff('__tests__/__fixtures__/before1.json',
    '__tests__/__fixtures__/after1.json', 'json'))
    .toBe(result);
});
