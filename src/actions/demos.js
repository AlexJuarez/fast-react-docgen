import { createAction } from 'redux-action';
import request from 'superagent';

const queries = {};

export default createAction('get demo', (filename) => {
  if (queries[filename]) {
    return;
  }

  queries[filename] = true;

  return new Promise((resolve, reject) => {
    request.get('/api/file')
      .query({ filename })
      .end((err, res) => {
        delete queries[filename];
        if (!err) {
          resolve({ file: filename, code: res.text });
        }

        reject(err);
      });
  });
});
