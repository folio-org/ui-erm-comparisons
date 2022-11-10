import { FormattedMessage } from 'react-intl';

const agreementFieldData = {
  'input': {
    'name': 'agreements[0].comparisonPoint',
    'value': {
      'id': 'c2ef50e0-c64f-437b-b3b8-82909505f2a3',
      'name': 'MR Test Agreement',
      'startDate': '2022-11-10',
      'status': 'Active',
      'endDate': '2022-11-30'
    }
  },
  'meta': {
    'active': false,
    'data': '{}',
    'dirty': true,
    'dirtySinceLastSubmit': false,
    'invalid': false,
    'modified': false,
    'modifiedSinceLastSubmit': false,
    'pristine': false,
    'submitFailed': false,
    'submitSucceeded': false,
    'submitting': false,
    'touched': false,
    'valid': true,
    'validating': false,
    'visited': false
  },
  'id': 'data-test-field-comparison-point-agreement',
  'index': 0,
  'required': true
};


const emptyAgreementField = {
  'input': {
    'name': 'agreements[0].comparisonPoint',
    'value': '',
    'onBlur': () => {},
    'onChange': () => {},
    'onFocus': () => {}
  },
  'meta': {
    'active': false,
    'data': '{}',
    'dirty': false,
    'dirtySinceLastSubmit': false,
    'error':'<Memo />',
    'invalid': true,
    'modified': false,
    'modifiedSinceLastSubmit': false,
    'pristine': true,
    'submitFailed': false,
    'submitSucceeded': false,
    'submitting': false,
    'touched': false,
    'valid': false,
    'validating': false,
    'visited': false
  },
  'id': 'data-test-field-comparison-point-agreement',
  'index': 0,
  'required': true
};

const agreementFieldError = {
  'input': {
    'name': 'agreements[0].comparisonPoint',
    'value': '',
  },
  'meta': {
    'active': false,
    'data': '{}',
    'dirty': false,
    'dirtySinceLastSubmit': false,
    'error': <FormattedMessage id="Please fill this in to continue" />,
    'invalid': true,
    'modified': false,
    'modifiedSinceLastSubmit': false,
    'pristine': true,
    'submitFailed': true,
    'submitSucceeded': false,
    'submitting': false,
    'touched': true,
    'valid': false,
    'validating': false,
    'visited': false
  },
  'id': 'data-test-field-comparison-point-agreement',
  'index': 0,
  'required': true
};

export { agreementFieldData, emptyAgreementField, agreementFieldError };
