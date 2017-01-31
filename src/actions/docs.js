import { createAction } from 'redux-action';
import request from 'superagent';

export default createAction('get docs', () =>
  new Promise((resolve, reject) => {
    request.get('/api/imports', (err, res) => {
      if (!err) {
        resolve(res.body);
      }

      reject(err);
    });
  })
);
