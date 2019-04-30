import _ from 'lodash/fp';
import fs from 'fs';
import path from 'path';
import parseData from './parsers';
import renderData from './renderers';

const getFileData = (filepath) => {
  const configPath = path.resolve(filepath);
  const data = fs.readFileSync(configPath, 'utf-8');
  const ext = path.extname(configPath);
  return parseData(ext, data);
};

const propertyActions = [
  {
    check: (obj1, obj2, key) => (_.has(key, obj1) && !_.has(key, obj2)),
    process: (obj1, obj2, key) => ({
      type: 'deleted',
      key,
      value: obj1[key],
    }),
  },
  {
    check: (obj1, obj2, key) => (!_.has(key, obj1) && _.has(key, obj2)),
    process: (obj1, obj2, key) => ({
      type: 'added',
      key,
      value: obj2[key],
    }),
  },
  {
    check: (obj1, obj2, key) => (obj1[key] instanceof Object && obj2[key] instanceof Object),
    process: (obj1, obj2, key, f) => ({
      type: 'complex',
      key,
      children: f(obj1[key], obj2[key]),
    }),
  },
  {
    check: (obj1, obj2, key) => (obj1[key] === obj2[key]),
    process: (obj1, obj2, key) => ({
      type: 'equal',
      key,
      value: obj2[key],
    }),
  },
  {
    check: () => true,
    process: (obj1, obj2, key) => ({
      type: 'changed',
      key,
      oldValue: obj1[key],
      newValue: obj2[key],
    }),
  },
];

const getPropertyAction = (obj1, obj2, key) => propertyActions
  .find(({ check }) => check(obj1, obj2, key));

const buildAst = (obj1, obj2) => {
  const allDiffKeys = _.union(Object.keys(obj1), Object.keys(obj2));
  const astTree = allDiffKeys.sort()
    .reduce((acc, el) => {
      const { process } = getPropertyAction(obj1, obj2, el);
      return [...acc, process(obj1, obj2, el, buildAst)];
    },
    []);
  return astTree;
};

const genDif = (filepathBefore, filepathAfter, format = 'tree') => {
  const fileContentBefore = getFileData(filepathBefore);
  const fileContentAfter = getFileData(filepathAfter);
  const astTree = buildAst(fileContentBefore, fileContentAfter);
  return renderData(format, astTree);
};

export default genDif;
