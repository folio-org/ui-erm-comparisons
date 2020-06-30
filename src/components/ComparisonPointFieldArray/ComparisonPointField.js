import React from 'react';
import PropTypes from 'prop-types';

import AgreementField from './AgreementField';
import PackageField from './PackageField';

class ComparisonPointField extends React.Component {
  static propTypes = {
    comparisonPoint: PropTypes.object,
    comparisonType: PropTypes.string,
    entitlements: PropTypes.arrayOf(PropTypes.object),
    onComparisonPointSelected: PropTypes.func.isRequired
  }

  render() {
    const { comparisonPoint, comparisonType, entitlements, onComparisonPointSelected, ...props } = this.props;
    if (comparisonType === 'agreement') {
      return (
        <AgreementField agreement={comparisonPoint} onAgreementSelected={onComparisonPointSelected} {...props} />
      );
    } else if (comparisonType === 'package') {
      return (
        // Not sorting these props so they're the same as the above for clarity
        // eslint-disable-next-line react/jsx-sort-props
        <PackageField entitlements={entitlements} package={comparisonPoint} onPackageSelected={onComparisonPointSelected} {...props} />
      );
    }
    return null;
  }
}

export default ComparisonPointField;
