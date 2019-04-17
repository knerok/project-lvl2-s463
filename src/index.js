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

const buildAst = (obj1, obj2) => {
  const firstObjKeys = Object.keys(obj1);
  const secondObjKeys = Object.keys(obj2);
  const allKeys = firstObjKeys.concat(secondObjKeys
    .filter(key => !_.has(key, obj1)));
  const astTree = allKeys
    .slice().sort()
    .reduce((acc, key) => {
      if (_.has(key, obj1) && !_.has(key, obj2)) {
        return [...acc, { key: `- ${key}`, value: obj1[key] }];
      }

      if (!_.has(key, obj1) && _.has(key, obj2)) {
        return [...acc, { key: `+ ${key}`, value: obj2[key] }];
      }

      if (obj1[key] instanceof Object && obj2[key] instanceof Object) {
        return [...acc, { key: `  ${key}`, children: buildAst(obj1[key], obj2[key]) }];
      }

      if (obj1[key] === obj2[key]) {
        return [...acc, { key: `  ${key}`, value: obj2[key] }];
      }

      return [...acc, { key: `- ${key}`, value: obj1[key] },
        { key: `+ ${key}`, value: obj2[key] }];
    }, []);
  return astTree;
};

const stringify = (value, depth) => {
  const keys = Object.keys(value);
  const answer = keys.map((key) => {
    if (value[key] instanceof Object) {
      return `${' '.repeat(depth)}${key}: {\n${stringify(value[key], depth + 4)}\n${' '.repeat(depth + 2)}}`;
    }
    return `${' '.repeat(depth)}${key}: ${value[key]}`;
  }).join('\n');
  return answer;
};

const render = (data, depth) => {
  const { key, value, children } = data;
  if (children) {
    return `${' '.repeat(depth)}${key}: {\n${children.map(el => render(el, depth + 4)).join('\n')}\n${' '.repeat(depth + 2)}}`;
  }
  if (value instanceof Object) {
    return `${' '.repeat(depth)}${key}: {\n${stringify(value, depth + 6)}\n${' '.repeat(depth + 2)}}`;
  }
  return `${' '.repeat(depth)}${key}: ${value}`;
};

const genDif = (filepath1, filepath2) => {
  const firstFile = getFileData(filepath1);
  const secondFile = getFileData(filepath2);
  const diffAstTree = buildAst(firstFile, secondFile);
  const answer = `{\n${diffAstTree.map(el => render(el, 2)).join('\n')}\n}`;
  return answer;
};


export default genDif;
