#!/usr/local/bin/node
const program = require('commander');

const pkg = require('./../package.json');
const constants = require('./../server/util/constants');
const Run = require('./../run');
const generateDll = require('./../generateDll');

program
  .command('generate:dll')
  .description('generates a new vendor dll')
  .action(() => {
    generateDll({ force: true });
  });

program
  .version(pkg.version)
  .command('start')
  .option('--demo-ext [ext]', 'Specify demo file extension: [ext]', '.demo.jsx')
  .option('-p, --port [port]', 'Specify port: [port]', parseInt, 8080)
  .option('-l, --log-level [level]', 'Specify log level: [level]', /^(debug|info|warn|error|off)$/i, constants.LOG_INFO)
  .action((options) => {
    Run(options);
  });

program.parse(process.argv);
