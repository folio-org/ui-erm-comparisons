// TODO Not a huge fan of these test resources tbh
// We should be mocking handlers and testing them, and that might as well happen in the tests themselves
// unless they're needed by multiple tests, which I doubt

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
  packageFieldData,
};
