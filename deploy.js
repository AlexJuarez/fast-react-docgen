const s3 = require('s3');
const path = require('path');

const client = s3.createClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const uploader = client.uploadDir({
  localDir: path.resolve(__dirname, 'public'),
  s3Params: {
    Bucket: 'txldocs',
  },
});

uploader.on('error', (err) => {
  console.log(err);
});

uploader.on('end', () => {
  console.log('done');
});
