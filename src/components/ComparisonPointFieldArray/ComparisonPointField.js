import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import AgreementField from './AgreementField';
import PackageField from './PackageField';

class ComparisonPointField extends React.Component {
  render() {
    const { comparisonPoint, comparisonType, onComparisonPointSelected, ...props } = this.props;
    switch (comparisonType) {
      case 'agreement':
        return (
          <AgreementField agreement={comparisonPoint} onAgreementSelected={onComparisonPointSelected} {...props} />
        );
      case 'package':
        return (
          // Not sorting these props so they're the same as the above for clarity
          // eslint-disable-next-line react/jsx-sort-props
          <PackageField package={comparisonPoint} onPackageSelected={onComparisonPointSelected} {...props} />
        );
      default:
        return null;
    }
  }
}

export default ComparisonPointField;
