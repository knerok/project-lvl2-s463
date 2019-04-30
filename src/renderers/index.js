import renderClassic from './renderTree';
import renderPlain from './renderPlain';

const renderers = {
  tree: renderClassic,
  plain: renderPlain,
  json: JSON.stringify,
};

const render = (format, astTree) => renderers[format](astTree);

export default render;
