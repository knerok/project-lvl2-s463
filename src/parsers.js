import yaml from 'js-yaml';

const extParserFuncs = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
};

const parser = (ext, data) => extParserFuncs[ext](data);

export default parser;
