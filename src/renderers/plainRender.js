
const iter = (acc, data, path) => {
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
  if (oldValue) return acc;
  if (newValue) {
    return [...acc, `Property '${path}${pureKey}' was updated. From ${valueBefore} to ${valueAfter}`];
  }
  if (key[0] === '+') {
    return [...acc, `Property '${path}${pureKey}' was added with value: ${valueBefore}`];
  }
  if (key[0] === '-') {
    return [...acc, `Property '${path}${pureKey}' was removed`];
  }
  if (children) {
    return children.reduce((accum, el) => iter(accum, el, `${path}${pureKey}.`), acc);
  }
  return acc;
};

const render = data => data.reduce((acc, el) => iter(acc, el, ''), []).filter(el => el !== '').join('\n');

export default render;
