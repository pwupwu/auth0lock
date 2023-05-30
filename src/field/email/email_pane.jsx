import PropTypes from 'prop-types';
import React from 'react';
import EmailInput from '../../ui/input/email_input';
import * as c from '../index';
import { swap, updateEntity } from '../../store/index';
import * as l from '../../core/index';
import { setEmail } from '../email';
import { debouncedRequestAvatar, requestAvatar } from '../../avatar';
import { debouncedRequestConnectionLookup, requestConnectionLookup } from '../../connection_lookup';

export function requestLookup() {
  if (l.ui.connectionLookup(lock) && c.email(lock)) {
    requestConnectionLookup(l.id(lock), c.email(lock));
  }
}

export default class EmailPane extends React.Component {
  componentDidMount() {
    const { lock } = this.props;
    if (l.ui.avatar(lock) && c.email(lock)) {
      requestAvatar(l.id(lock), c.email(lock));
    }
    setTimeout(requestLookup, 500);
    setTimeout(requestLookup, 1000);
    setTimeout(requestLookup, 2000);
  }

  handleChange(e) {
    const { lock } = this.props;
    if (l.ui.avatar(lock)) {
      debouncedRequestAvatar(l.id(lock), e.target.value);
    }
    if (l.ui.connectionLookup(lock)) {
      debouncedRequestConnectionLookup(l.id(lock), e.target.value);
    }

    swap(updateEntity, 'lock', l.id(lock), setEmail, e.target.value);
  }

  render() {
    const { i18n, lock, placeholder, forceInvalidVisibility = false } = this.props;
    const allowAutocomplete = l.ui.allowAutocomplete(lock);

    const field = c.getField(lock, 'email');
    const value = field.get('value', '');
    const valid = field.get('valid', true);
    const invalidHint =
      field.get('invalidHint') || i18n.str(value ? 'invalidErrorHint' : 'blankErrorHint');

    const isValid = (!forceInvalidVisibility || valid) && !c.isFieldVisiblyInvalid(lock, 'email');

    return (
      <EmailInput
        lockId={l.id(lock)}
        value={value}
        invalidHint={invalidHint}
        isValid={isValid}
        onChange={::this.handleChange}
        placeholder={placeholder}
        autoComplete={allowAutocomplete}
      />
    );
  }
}

EmailPane.propTypes = {
  i18n: PropTypes.object.isRequired,
  lock: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired
};
