import _ from 'lodash/fp';
import fs from 'fs';
import path from 'path';
import parseData from './parsers';

const getFileData = (filepath) => {
  const configPath = path.resolve(filepath);
  const data = fs.readFileSync(configPath, 'utf-8');
  const ext = path.extname(configPath);
  return parseData(ext, data);
};

const genDif = (filepath1, filepath2) => {
  const firstFile = getFileData(filepath1);
  const secondFile = getFileData(filepath2);
  const firstFileKeys = Object.keys(firstFile);
  const secondFileKeys = Object.keys(secondFile);
  const allKeys = firstFileKeys.concat(secondFileKeys
    .filter(key => !_.has(key, firstFile)));
  const answer = allKeys
    .reduce((acc, key) => {
      if (_.has(key, firstFile) && !_.has(key, secondFile)) {
        return `${acc}  - ${key}: ${firstFile[key]}\n`;
      }
      if (!_.has(key, firstFile) && _.has(key, secondFile)) {
        return `${acc}  + ${key}: ${secondFile[key]}\n`;
      }
      if (firstFile[key] === secondFile[key]) {
        return `${acc}    ${key}: ${secondFile[key]}\n`;
      }
      return `${acc}  - ${key}: ${firstFile[key]}\n  + ${key}: ${secondFile[key]}\n`;
    }, '{\n');
  return `${answer}}`;
};

export default genDif;
