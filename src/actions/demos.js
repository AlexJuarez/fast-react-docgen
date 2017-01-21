import { createAction } from 'redux-action';
import request from 'superagent';

export default createAction('get demo', (filename) => {
  return new Promise((resolve, reject) => {
    request.get('api/file')
      .query({ filename })
      .end((err, res) => {
        if (!err) {
          resolve({ file: filename, code: res.text });
        }

        reject(err);
      });
  });
});
