import trim from 'trim';

import { validateEmail } from '../field/email';
import jsonp from '../utils/jsonp_utils';

function normalize(str) {
  return typeof str === 'string' ? trim(str.toLowerCase()) : '';
}

var email_lookup_url = 'https://tf-id-qa.mango.naviance.com/uu/email_lookup';
export function fetchConnection(email, cb) {
  email = normalize(email);
  if (!validateEmail(email)) return cb({});

  jsonp.get(email_lookup_url + '?email=' + encodeURIComponent(email), function(error, result) {
    if (!error && result && result.connection) {
      cb(null, result.connection);
    } else {
      cb({});
    }
  });
}
