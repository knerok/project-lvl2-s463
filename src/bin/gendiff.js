#!/usr/bin/env node

import program from 'commander';
import { version } from '../../package.json';
import genDiff from '..';

program
  .version(version)
  .arguments('<firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig, options) => {
    const { format } = options;
    console.log(genDiff(firstConfig, secondConfig, format));
  })
  .parse(process.argv);
