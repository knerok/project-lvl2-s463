import _ from 'lodash/fp';
import fs from 'fs';
import path from 'path';
import parseData from './parsers';
import renderData from './renderers/renderers';

const getFileData = (filepath) => {
  const configPath = path.resolve(filepath);
  const data = fs.readFileSync(configPath, 'utf-8');
  const ext = path.extname(configPath);
  return parseData(ext, data);
};

const propertyActions = [
  {
    type: 'deleted',
    value: (obj1, obj2, arg) => obj1[arg],
    check: (obj1, obj2, arg) => (_.has(arg, obj1) && !_.has(arg, obj2)),
  },
  {
    type: 'added',
    value: (obj1, obj2, arg) => obj2[arg],
    check: (obj1, obj2, arg) => (!_.has(arg, obj1) && _.has(arg, obj2)),
  },
  {
    type: 'equal',
    children: (obj1, obj2, arg, f) => f(obj1[arg], obj2[arg]),
    check: (obj1, obj2, arg) => (obj1[arg] instanceof Object && obj2[arg] instanceof Object),
  },
  {
    type: 'complex',
    value: (obj1, obj2, arg) => obj2[arg],
    check: (obj1, obj2, arg) => (obj1[arg] === obj2[arg]),
  },
  {
    type: 'changed',
    oldValue: (obj1, obj2, arg) => obj1[arg],
    newValue: (obj1, obj2, arg) => obj2[arg],
    check: () => true,
  },
];

const getPropertyAction = (obj1, obj2, arg) => propertyActions
  .find(({ check }) => check(obj1, obj2, arg));

const buildAst = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const allDiffKeys = obj1Keys.concat(obj2Keys
    .filter(key => !_.has(key, obj1)));
  const astTree = allDiffKeys.sort()
    .reduce((acc, el) => {
      const {
        type,
        value = () => undefined,
        oldValue = () => undefined,
        newValue = () => undefined,
        children = () => undefined,
      } = getPropertyAction(obj1, obj2, el);
      return [...acc,
        {
          type,
          key: el,
          value: value(obj1, obj2, el),
          children: children(obj1, obj2, el, buildAst),
          oldValue: oldValue(obj1, obj2, el),
          newValue: newValue(obj1, obj2, el),
        }];
    }, []);
  return astTree;
};

const genDif = (filepathBefore, filepathAfter, format = 'tree') => {
  const fileContentBefore = getFileData(filepathBefore);
  const fileContentAfter = getFileData(filepathAfter);
  const astTree = buildAst(fileContentBefore, fileContentAfter);
  return renderData[format](astTree);
};

export default genDif;
