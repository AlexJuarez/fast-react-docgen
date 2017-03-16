const s3 = require('s3');
const path = require('path');
const fs = require('fs-extra');
const mime = require('mime');
const glob = require('glob');
const { gzip } = require('zlib');
const createDemoMap = require('./server/util/createDemoMap');
const getTxlRoot = require('./server/getTxlRoot');

const upload = ({ awsKey, awsSecret, bucket, region }) => new Promise((resolve, reject) => {
  const client = s3.createClient({
    s3Options: {
      accessKeyId: awsKey,
      region,
      secretAccessKey: awsSecret,
    },
  });

  const uploader = client.uploadDir({
    localDir: path.resolve(__dirname, 'public'),
    s3Params: {
      Bucket: bucket,
    },
    getS3Params: (localFile, stat, callback) => {
      const s3Params = {
        ContentEncoding: 'gzip',
        ContentType: mime.lookup(localFile, 'application/json'),
      };

      callback(null, s3Params);
    },
  });

  uploader.on('error', (err) => {
    reject(err);
  });

  uploader.on('end', () => {
    console.log('upload complete');
    resolve();
  });
});

const compress = () => new Promise((resolve) => {
  const files = glob.sync('**/*', { absolute: true, cwd: path.resolve(__dirname, 'public'), nodir: true });

  return Promise.all(files
    .map(file => new Promise((done) => {
      const content = fs.readFileSync(file);
      gzip(content.toString(), (err, result) => {
        fs.writeFileSync(file, result);
        done();
      });
    }))
  ).then(() => {
    console.log('gzip compression complete');
    resolve();
  });
});

const build = ({ demoExt }) => new Promise((resolve) => {
  fs.emptyDirSync(path.resolve(__dirname, 'public'));

  const TXL_ROOT = getTxlRoot();

  createDemoMap({ cwd: TXL_ROOT, demoExt }).then(() => {
    process.env.NODE_ENV = 'production';
    const compiler = require('webpack')(require('./webpack.config'));
    compiler.run((err, stats) => {
      compress();
      resolve(stats);
    });
  });
});

const Deploy = (opts) => {
  const cmds = [
    (opts.build ? () => build(opts) : null),
    (opts.upload ? () => upload(opts) : null)
  ];

  const execute = (fns) => {
    if (!fns.length) {
      return;
    }

    const [fn, ...rest] = fns;

    if (fn == null) {
      execute(rest);
      return;
    }

    fn().then(() => {
      execute(rest);
    }).catch((err) => {
      console.warn(err);
    });
  };

  execute(cmds);
};

module.exports = Deploy;
