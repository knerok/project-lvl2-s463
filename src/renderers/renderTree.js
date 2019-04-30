
const stringify = (value, depth) => {
  if (!(value instanceof Object)) {
    return `${value}`;
  }
  const keys = Object.keys(value);
  const answer = keys.map(key => `${' '.repeat(depth + 6)}${key}: ${stringify(value[key], depth + 4)}`)
    .join('\n');
  return `{\n${answer}\n${' '.repeat(depth + 2)}}`;
};

const renderersForNodes = {
  deleted: ({ key, value }, depth) => (`- ${key}: ${stringify(value, depth)}`),
  added: ({ key, value }, depth) => (`+ ${key}: ${stringify(value, depth)}`),
  complex: ({ key, children }, depth, f) => (`  ${key}: {\n${children.map(el => f(el, depth + 4)).join('\n')}\n${' '.repeat(depth + 2)}}`),
  changed: ({ key, oldValue, newValue }, depth) => (`- ${key}: ${stringify(oldValue, depth)}\n${' '.repeat(depth)}+ ${key}: ${stringify(newValue, depth)}`),
  equal: ({ key, value }, depth) => (`  ${key}: ${stringify(value, depth)}`),
};

const generateTree = (data, depth) => {
  const { type } = data;
  const renderedNode = renderersForNodes[type](data, depth, generateTree);
  const indent = ' '.repeat(depth);
  return `${indent}${renderedNode}`;
};

const render = data => `{\n${data.map(el => generateTree(el, 2)).join('\n')}\n}`;

export default render;
