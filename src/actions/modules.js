import { createAction } from 'redux-action';
import request from 'superagent';

export default createAction('get modules', () => {
  return new Promise((resolve, reject) => {
    request.get('/api/modules', (err, res) => {
      if (!err) {
        resolve(res.body);
      }

      reject(err);
    });
  });
});
