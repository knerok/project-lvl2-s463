import { flattenDeep } from 'lodash/fp';

const renderersForNodes = {
  deleted: ({ currentPath }) => (`Property '${currentPath}' was removed`),
  added: ({ currentPath, valueMain }) => (`Property '${currentPath}' was added with value: ${valueMain}`),
  complex: ({ currentPath, children }, generatePlain) => (generatePlain(children, `${currentPath}.`)),
  changed: ({
    currentPath,
    valueBefore,
    valueAfter,
  }) => (`Property '${currentPath}' was updated. From ${valueBefore} to ${valueAfter}`),
  equal: () => (null),
};

const renderValue = value => ((value instanceof Object) ? '[complex value]' : value);

const generatePlain = (data, path) => data.map((el) => {
  const {
    type,
    key,
    value,
    newValue,
    oldValue,
    children,
  } = el;
  const valueMain = renderValue(value);
  const valueBefore = renderValue(oldValue);
  const valueAfter = renderValue(newValue);
  const currentPath = `${path}${key}`;
  const renderedNode = renderersForNodes[type]({
    currentPath,
    valueMain,
    valueBefore,
    valueAfter,
    children,
  }, generatePlain);
  return renderedNode;
});

const render = data => flattenDeep(generatePlain(data, '')).filter(el => el).join('\n');

export default render;
