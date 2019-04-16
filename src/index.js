import _ from 'lodash/fp';
import fs from 'fs';
import path from 'path';

const genDif = (filepath1, filepath2) => {
  const firstJson = JSON.parse(fs.readFileSync(path.resolve(filepath1), 'utf-8'));
  const secondJson = JSON.parse(fs.readFileSync(path.resolve(filepath2), 'utf-8'));
  const firstFileKeys = Object.keys(firstJson);
  const secondFileKeys = Object.keys(secondJson);
  const allKeys = firstFileKeys.concat(secondFileKeys
    .filter(key => !_.has(key, firstJson)));
  const answer = allKeys
    .reduce((acc, key) => {
      if (_.has(key, firstJson) && !_.has(key, secondJson)) {
        return `${acc}  - ${key}: ${firstJson[key]}\n`;
      }
      if (!_.has(key, firstJson) && _.has(key, secondJson)) {
        return `${acc}  + ${key}: ${secondJson[key]}\n`;
      }
      if (firstJson[key] === secondJson[key]) {
        return `${acc}    ${key}: ${secondJson[key]}\n`;
      }
      return `${acc}  - ${key}: ${firstJson[key]}\n  + ${key}: ${secondJson[key]}\n`;
    }, '{\n');
  return `${answer}}`;
};

genDif('/home/andrey/Desktop/pr2/__tests__/__fixtures__/before.json',
'__tests__/__fixtures__/after.json');

export default genDif;
