import { flattenDeep } from 'lodash/fp';

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
  deleted: ({ key, value }, depth, indent) => (`${indent}- ${key}: ${stringify(value, depth)}`),
  added: ({ key, value }, depth, indent) => (`${indent}+ ${key}: ${stringify(value, depth)}`),
  complex: ({ key, children }, depth, indent, generateTree) => (`${indent}  ${key}: {\n${flattenDeep(generateTree(children, depth + 4)).join('\n')}\n${' '.repeat(depth + 2)}}`),
  changed: ({ key, oldValue, newValue }, depth, indent) => [`${indent}- ${key}: ${stringify(oldValue, depth)}`,
    `${indent}+ ${key}: ${stringify(newValue, depth)}`],
  equal: ({ key, value }, depth, indent) => (`${indent}  ${key}: ${stringify(value, depth)}`),
};

const generateTree = (data, depth) => data.map((el) => {
  const { type } = el;
  const indent = ' '.repeat(depth);
  const renderedNode = renderersForNodes[type](el, depth, indent, generateTree);
  return renderedNode;
});

const render = data => `{\n${flattenDeep(generateTree(data, 2)).join('\n')}\n}`;

export default render;
