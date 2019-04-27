const signs = {
  deleted: '- ',
  added: '+ ',
  equal: '  ',
  changed: '- ',
  complex: '  ',
};

const stringify = (value, depth) => {
  if (!(value instanceof Object)) {
    return `${value}`;
  }
  const keys = Object.keys(value);
  const answer = keys.map(key => `${' '.repeat(depth)}${key}: ${stringify(value[key], depth + 4)}`)
    .join('\n');
  return `{\n${answer}\n${' '.repeat(depth - 4)}}`;
};

const buildClassic = (data, depth) => {
  const {
    type,
    key,
    value,
    children,
    oldValue,
    newValue,
  } = data;
  const sign = signs[type];
  if (children) {
    return `${' '.repeat(depth)}${sign}${key}: {\n${children.map(el => buildClassic(el, depth + 4)).join('\n')}\n${' '.repeat(depth + 2)}}`;
  }
  const valueForRender = (oldValue || value);
  const newValueLine = type === 'changed' ? `\n${' '.repeat(depth)}+ ${key}: ${stringify(newValue, depth + 6)}` : '';
  return `${' '.repeat(depth)}${sign}${key}: ${stringify(valueForRender, depth + 6)}${newValueLine}`;
};

const render = data => `{\n${data.map(el => buildClassic(el, 2)).join('\n')}\n}`;

export default render;
