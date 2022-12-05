const agreementFieldData = {
  'id': 'data-test-field-comparison-point-agreement',
  'index': 0,
  onAgreementSelected: jest.fn(),
  'required': true
};

const comparisonPointFieldPackage = {
  'comparisonType': 'package',
  'entitlements': {},
  'id': 'data-test-field-comparison-point-package',
  'index': 0,
  onComparisonPointSelected: jest.fn(),
  'required': true
};

const comparisonPointFieldAgreement = {
  'comparisonType': 'agreement',
  'id': 'data-test-field-comparison-point-agreement',
  'index': 0,
  onComparisonPointSelected: jest.fn(),
  'required': true
};

const comparisonPointFieldArrayPackage = {
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
  'id': 'data-test-field-comparison-point-package',
  'index': 0,
  onPackageSelected: jest.fn(),
  'required': true
};

export {
  agreementFieldData,
  comparisonPointFieldPackage,
  comparisonPointFieldAgreement,
  comparisonPointFieldArrayPackage,
  comparisonPointFieldArrayAgreement,
  packageFieldData,
};
