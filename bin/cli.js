#!/usr/bin/env node
const program = require('commander');

const pkg = require('./../package.json');
const constants = require('./../server/util/constants');
const Run = require('./../run');

program
  .version(pkg.version);

program
  .command('start <file>')
  .option('-p, --port <port>', 'Specify port: <port>', v => parseInt(v, 10), 8080)
  .option('-l, --log-level [level]', 'Specify log level: [level]', /^(debug|info|warn|error|off)$/i, constants.LOG_INFO)
  .option('-s, --stats', 'Show colored stats output', false)
  .action((file, options) => {
    Run(file, options);
  });

program.parse(process.argv);
