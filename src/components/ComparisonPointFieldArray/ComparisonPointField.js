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
      comparisonPoint,
      comparisonType,
      entitlements,
      onComparisonPointSelected,
      ...rest
    } = this.props;

    return comparisonType === 'agreement' ? (
      <AgreementField
        agreement={comparisonPoint}
        onAgreementSelected={onComparisonPointSelected}
        {...rest}
      />
    ) : (
      <PackageField
        entitlements={entitlements}
        onPackageSelected={onComparisonPointSelected}
        package={comparisonPoint}
        {...rest}
      />
    );
  }
}

export default ComparisonPointField;
