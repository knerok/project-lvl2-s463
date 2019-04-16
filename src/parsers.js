import yaml from 'js-yaml';
import ini from 'ini';

const extParserFuncs = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parser = (ext, data) => extParserFuncs[ext](data);

export default parser;
