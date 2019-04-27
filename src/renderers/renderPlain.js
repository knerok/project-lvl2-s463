/*
const propertyActions = [
  {
    process: (accMain, currentPath, valueMain, valueBefore, valueAfter) =>
    [...accMain, `Property '${currentPath}' was updated. From ${valueBefore} to ${valueAfter}`],
    check: type => (type === 'changed'),
  },
  {
    process: (accMain, currentPath, valueMain) =>
    [...accMain, `Property '${currentPath}' was added with value: ${valueMain}`],
    check: type => (type === 'added'),
  },
  {
    process: (accMain, currentPath) => [...accMain, `Property '${currentPath}' was removed`],
    check: type => (type === 'deleted'),
  },
  {
    process: accMain => accMain,
    check: () => true,
  },
];
*/

const propertyActions = {
  deleted: (accMain, currentPath) => [...accMain, `Property '${currentPath}' was removed`],
  added: (accMain, currentPath, valueMain) => [...accMain, `Property '${currentPath}' was added with value: ${valueMain}`],
  equal: accMain => accMain,
  changed: (accMain, currentPath, valueMain, valueBefore, valueAfter) => [...accMain, `Property '${currentPath}' was updated. From ${valueBefore} to ${valueAfter}`],
  complex: accMain => accMain,
};

const generatePlain = (accMain, el, path) => {
  const {
    type,
    key,
    value,
    children,
    newValue,
    oldValue,
  } = el;
  const valueMain = (value instanceof Object) ? '[complex value]' : value;
  const valueBefore = (oldValue instanceof Object) ? '[complex value]' : oldValue;
  const valueAfter = (newValue instanceof Object) ? '[complex value]' : newValue;
  const currentPath = `${path}${key}`;
  if (children) {
    return children.reduce((acc, child) => generatePlain(acc, child, `${currentPath}.`), accMain);
  }
  const process = propertyActions[type];
  return process(accMain, currentPath, valueMain, valueBefore, valueAfter);
};

const render = data => data.reduce((acc, el) => generatePlain(acc, el, ''), []).filter(el => el !== '').join('\n');

export default render;
