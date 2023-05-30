import { getEntity, read, swap, updateEntity } from './store/index';
import { dataFns } from './utils/data_utils';
//import * as preload from './utils/preload_utils';
import * as f from './utils/fn_utils';
import * as l from './core/index';

const { tget, tset } = dataFns(['emailConnection']);

const cache = {};

export function requestConnectionLookup(id, emailInput) {
  if (!emailInput) {
    return;
  }
  const provider = l.ui.connectionLookupProvider(read(getEntity, 'lock', id)).toJS();

  swap(updateEntity, 'lock', id, m => {
    m = tset(m, 'clStatus', 'loading');
    m = tset(m, 'emailInput', emailInput);
    m = tset(m, 'connectionStr', '');
    return m;
  });

  provider.fetchConnection(emailInput, (error, connectionStr) => {
    if (error) return handleError(id, emailInput);
    handleSuccess(id, emailInput, connectionStr);
  });
}

export const debouncedRequestConnectionLookup = f.debounce(requestConnectionLookup, 350);

function handleSuccess(id, emailInput, connectionStr) {
  if (!connectionStr) {
    return;
  }
  cache[emailInput] = { connectionStr };
  console.log('calling update: ' + connectionStr);
  update(id, emailInput, connectionStr);
}

function update(id, emailInput, connectionStr) {
  swap(updateEntity, 'lock', id, m => {
    if (tget(m, 'emailInput') === emailInput) {
      m = tset(m, 'clStatus', 'ok');
      m = tset(m, 'connectionStr', connectionStr);
    }
    return m;
  });
}

function handleError(id, emailInput) {
  swap(updateEntity, 'lock', id, m => {
    if (tget(m, 'emailInput') === emailInput) {
      m = tset(m, 'clStatus', 'error');
      m = tset(m, 'connectionStr', '');
    }
    return m;
  });
}
