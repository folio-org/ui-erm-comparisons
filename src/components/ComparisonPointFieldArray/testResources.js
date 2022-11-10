import {
  FormattedMessage
} from 'react-intl';

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
    'error': '<Memo />',
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

const comparisonPointFieldPackage = {
  'input': {
    'name': 'packages[0].comparisonPoint',
    'value': {
      'id': '36e9c808-13c6-4946-b824-4fe2ad3ba860',
      'name': 'ACM Digtal Library',
      'count': 10650,
      'provider': 'Association for Computing Machinery'
    }
  },
  'meta': {
    'active': false,
    'data': '{}',
    'dirty': true,
    'dirtySinceLastSubmit': true,
    'invalid': false,
    'modified': false,
    'modifiedSinceLastSubmit': false,
    'pristine': false,
    'submitFailed': true,
    'submitSucceeded': false,
    'submitting': false,
    'touched': false,
    'valid': true,
    'validating': false,
    'visited': false
  },
  'comparisonType': 'package',
  'entitlements': {},
  'id': 'data-test-field-comparison-point-package',
  'index': 0,
  'required': true
};

const comparisonPointFieldAgreement = {
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

  'comparisonType': 'agreement',
  'id': 'data-test-field-comparison-point-agreement',
  'index': 0,
  'required': true
};

const comparisonPointFieldArrayPackage = {
  'fields': {
    'name': 'packages',
    'forEach': 'ƒ forEach() {}',
    'length': 1,
    'map': 'ƒ map() {}',
    'insert': 'ƒ () {}',
    'concat': 'ƒ () {}',
    'move': 'ƒ () {}',
    'pop': 'ƒ () {}',
    'push': 'ƒ () {}',
    'remove': 'ƒ () {}',
    'removeBatch': 'ƒ () {}',
    'shift': 'ƒ () {}',
    'swap': 'ƒ () {}',
    'unshift': 'ƒ () {}',
    'update': 'ƒ () {}',
    'value': [
      {
        '_delete': false,
        'onDate': '2022-11-10T00:00:00.000Z',
        'comparisonPoint': {
          'id': '810dfe8a-df91-4a7f-9200-00655620828a',
          'name': 'ACM Digtal Library',
          'count': 10650,
          'provider': 'Association for Computing Machinery'
        }
      }
    ]
  },
  'meta': {
    'touched': false,
  },
  'addButtonId': 'data-test-add-package-button',
  'addLabelId': 'ui-erm-comparisons.newComparison.addPackage',
  'comparisonPoint': 'package',
  'data': {
    'entitlements': '{}'
  },
  'data-test-field-array-packages': true,
  'deleteButtonTooltipId': 'ui-erm-comparisons.newComparison.removePackage',
  'disableAddNew': true,
  'handlers': {
    'onEResourceAdded': 'ƒ onEResourceAdded() {}',
    'onEResourceRemoved': 'ƒ onEResourceRemoved() {}'
  },
  'headerId': 'ui-erm-comparisons.newComparison.packageTitle',
  'id': 'comparison-point-form-packages'
};

const comparisonPointFieldArrayAgreement = {
  'fields': {
    'name': 'agreements',
    'forEach': 'ƒ forEach() {}',
    'length': 1,
    'map': 'ƒ map() {}',
    'insert': 'ƒ () {}',
    'concat': 'ƒ () {}',
    'move': 'ƒ () {}',
    'pop': 'ƒ () {}',
    'push': 'ƒ () {}',
    'remove': 'ƒ () {}',
    'removeBatch': 'ƒ () {}',
    'shift': 'ƒ () {}',
    'swap': 'ƒ () {}',
    'unshift': 'ƒ () {}',
    'update': 'ƒ () {}',
    'value': [
      {
        '_delete': false,
        'onDate': '2022-11-10T00:00:00.000Z',
        'comparisonPoint': {
          'id': 'd4f602ec-4ec4-4a22-be94-07e2c04f733b',
          'name': 'MR Test',
          'startDate': '2022-11-03',
          'status': 'Active',
          'endDate': '2022-11-25'
        }
      }
    ]
  },
  'meta': {
    'touched': false,
  },
  'addButtonId': 'data-test-add-agreement-button',
  'addLabelId': 'ui-erm-comparisons.newComparison.addAgreement',
  'comparisonPoint': 'agreement',
  'data-test-field-array-agreements': true,
  'deleteButtonTooltipId': 'ui-erm-comparisons.newComparison.removeAgreement',
  'disableAddNew': true,
  'headerId': 'ui-erm-comparisons.newComparison.agreementTitle',
  'id': 'comparison-point-form-agreements'
};

const packageFieldData = {
  'entitlements': {},
  'onPackageSelected': 'ƒ onComparisonPointSelected() {}',
  'input': {
    'name': 'packages[0].comparisonPoint',
    'value': {
      'id': '810dfe8a-df91-4a7f-9200-00655620828a',
      'name': 'ACM Digtal Library',
      'count': 10650,
      'provider': 'Association for Computing Machinery'
    }
  },
  'meta': {
    'touched': false,
  },
  'id': 'data-test-field-comparison-point-package',
  'index': 0,
  'required': true
};

const emptyPackageField = {
  'entitlements': {},
  'input': {
    'name': 'packages[0].comparisonPoint',
    'value': '',
  },
  'meta': {
    'error': '<Memo />',
    'touched': false,
  },
  'id': 'data-test-field-comparison-point-package',
  'index': 0,
  'required': true
};

const packageFieldError = {
  'entitlements': {},
  'onPackageSelected': 'ƒ onComparisonPointSelected() {}',
  'input': {
    'name': 'packages[0].comparisonPoint',
    'value': '',
  },
  'meta': {
    'error': <FormattedMessage id="Please fill this in to continue" />,
    'touched': true,
  },
  'id': 'data-test-field-comparison-point-package',
  'index': 0,
  'required': true
};

export {
  agreementFieldData,
  emptyAgreementField,
  agreementFieldError,
  comparisonPointFieldPackage,
  comparisonPointFieldAgreement,
  comparisonPointFieldArrayPackage,
  comparisonPointFieldArrayAgreement,
  packageFieldData,
  emptyPackageField,
  packageFieldError
};
