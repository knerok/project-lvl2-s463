import _ from 'lodash/fp';
import fs from 'fs';
import path from 'path';
import parseData from './parsers';
import renderJson from './renderers/firstRender';
import renderPlain from './renderers/plainRender';

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

      return [...acc, { key: `- ${key}`, value: obj1[key], newValue: obj2[key] },
        { key: `+ ${key}`, value: obj2[key], oldValue: obj1[key] }];
    }, []);
  return astTree;
};

const renderers = {
  classic: renderJson,
  plain: renderPlain,
  JSON: JSON.stringify,
};

const genDif = (filepath1, filepath2, format = 'classic') => {
  const firstFile = getFileData(filepath1);
  const secondFile = getFileData(filepath2);
  const astTree = buildAst(firstFile, secondFile);
  return renderers[format](astTree);
};

export default genDif;
