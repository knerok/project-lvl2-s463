
const generatePlain = (accMain, data, path) => {
  const {
    key,
    value,
    children,
    newValue,
    oldValue,
  } = data;
  const valueBefore = (value instanceof Object) ? '[complex value]' : value;
  const valueAfter = (newValue instanceof Object) ? '[complex value]' : newValue;
  const pureKey = key.slice(2, key.length);
  if (oldValue) return accMain;
  if (newValue) {
    return [...accMain, `Property '${path}${pureKey}' was updated. From ${valueBefore} to ${valueAfter}`];
  }
  if (key[0] === '+') {
    return [...accMain, `Property '${path}${pureKey}' was added with value: ${valueBefore}`];
  }
  if (key[0] === '-') {
    return [...accMain, `Property '${path}${pureKey}' was removed`];
  }
  if (children) {
    return children.reduce((acc, el) => generatePlain(acc, el, `${path}${pureKey}.`), accMain);
  }
  return accMain;
};

const render = data => data.reduce((acc, el) => generatePlain(acc, el, ''), []).filter(el => el !== '').join('\n');

export default render;
