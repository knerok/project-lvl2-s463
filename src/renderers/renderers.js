import renderClassic from './renderTree';
import renderPlain from './renderPlain';

const renderers = {
  tree: renderClassic,
  plain: renderPlain,
  json: JSON.stringify,
};

export default renderers;
