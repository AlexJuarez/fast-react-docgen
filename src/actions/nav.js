import { createAction } from 'redux-action';
import request from 'superagent';

export default createAction('get nav data', () => {
  return new Promise((resolve, reject) => {
    request.get('api/nav', (err, res) => {
      if (!err) {
        resolve(res.body.categories);
      }

      reject(err);
    });
  });
});
