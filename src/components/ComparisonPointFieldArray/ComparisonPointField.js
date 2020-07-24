import React from 'react';
import PropTypes from 'prop-types';

import AgreementField from './AgreementField';
import PackageField from './PackageField';

class ComparisonPointField extends React.Component {
  static propTypes = {
    comparisonPoint: PropTypes.object,
    comparisonType: PropTypes.string,
    entitlements: PropTypes.object,
    onComparisonPointSelected: PropTypes.func.isRequired
  }

  render() {
    const {
      comparisonType,
      entitlements,
      onComparisonPointSelected,
      ...rest
    } = this.props;

    return comparisonType === 'agreement' ? (
      <AgreementField
        onAgreementSelected={onComparisonPointSelected}
        {...rest}
      />
    ) : (
      <PackageField
        entitlements={entitlements}
        onPackageSelected={onComparisonPointSelected}
        {...rest}
      />
    );
  }
}

export default ComparisonPointField;
