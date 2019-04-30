
const renderersForNodes = {
  deleted: ({ accMain, currentPath }) => ([...accMain, `Property '${currentPath}' was removed`]),
  added: ({ accMain, currentPath, valueMain }) => ([...accMain, `Property '${currentPath}' was added with value: ${valueMain}`]),
  complex: ({ accMain, currentPath, children }, f) => (children.reduce((acc, child) => f(acc, child, `${currentPath}.`), accMain)),
  changed: ({
    accMain,
    currentPath,
    valueBefore,
    valueAfter,
  }) => ([...accMain, `Property '${currentPath}' was updated. From ${valueBefore} to ${valueAfter}`]),
  equal: ({ accMain }) => accMain,
};

const generatePlain = (accMain, el, path) => {
  const {
    type,
    key,
    value,
    newValue,
    oldValue,
    children,
  } = el;
  const valueMain = (value instanceof Object) ? '[complex value]' : value;
  const valueBefore = (oldValue instanceof Object) ? '[complex value]' : oldValue;
  const valueAfter = (newValue instanceof Object) ? '[complex value]' : newValue;
  const currentPath = `${path}${key}`;
  const renderedNode = renderersForNodes[type]({
    accMain,
    currentPath,
    valueMain,
    valueBefore,
    valueAfter,
    children,
  }, generatePlain);
  return renderedNode;
};

const render = data => data.reduce((acc, el) => generatePlain(acc, el, ''), []).join('\n');

export default render;
