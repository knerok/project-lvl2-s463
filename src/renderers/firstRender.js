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

export default render;
