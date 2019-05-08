import { flattenDeep } from 'lodash/fp';

const renderersForNodes = {
  deleted: ({ acc, currentPath }) => ([...acc, `Property '${currentPath}' was removed`]),
  added: ({ acc, currentPath, valueMain }) => ([...acc, `Property '${currentPath}' was added with value: ${valueMain}`]),
  complex: ({ acc, currentPath, children }, generatePlain) => ([...acc, generatePlain(children, `${currentPath}.`)]),
  changed: ({
    acc,
    currentPath,
    valueBefore,
    valueAfter,
  }) => ([...acc, `Property '${currentPath}' was updated. From ${valueBefore} to ${valueAfter}`]),
  equal: ({ acc }) => acc,
};

const renderValue = value => ((value instanceof Object) ? '[complex value]' : value);

const generatePlain = (data, path) => data.reduce((acc, el) => {
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
    acc,
    currentPath,
    valueMain,
    valueBefore,
    valueAfter,
    children,
  }, generatePlain);
  return renderedNode;
}, []);

const render = data => flattenDeep(generatePlain(data, '')).join('\n');

export default render;
