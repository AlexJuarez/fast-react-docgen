#!/usr/bin/env node
const program = require('commander');

const pkg = require('./../package.json');
const constants = require('./../server/util/constants');
const Run = require('./../run');
const generateDll = require('./../webpack/generateDll');
const Deploy = require('./../deploy');
const invariant = require('invariant');

program
  .version(pkg.version);

program
  .command('generate:dll')
  .description('generates a new vendor dll')
  .action(() => {
    generateDll(true);
  });

program
  .command('start')
  .option('--demo-ext [ext]', 'Specify demo file extension: [ext]', '.demo.jsx')
  .option('-p, --port [port]', 'Specify port: [port]', parseInt, 8080)
  .option('-l, --log-level [level]', 'Specify log level: [level]', /^(debug|info|warn|error|off)$/i, constants.LOG_INFO)
  .action((options) => {
    Run(options);
  });

program
  .command('deploy')
  .option('-b, --s3-bucket [bucket]', 'The S3 Bucket', 'tune-frontend')
  .option('-B, --no-build', 'Do not preform the build, and don\'t upload', false)
  .option('-U, --no-upload', 'Do not preform the upload, don\'t build', false)
  .option('-i, --key-id [id]', 'The AWS access key id', process.env.AWS_ACCESS_KEY_ID)
  .option('-s, --secret-key [id]', 'The AWS secret access key id', process.env.AWS_SECRET_ACCESS_KEY)
  .action((options) => {
    Deploy({
      awsKey: options.keyId,
      awsSecret: options.secretKey,
      bucket: options.s3Bucket,
      build: options.build,
      upload: options.upload,
    });
  });

program.parse(process.argv);
