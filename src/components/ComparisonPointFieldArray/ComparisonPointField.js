import React from 'react';
import PropTypes from 'prop-types';

import AgreementField from './AgreementField';
import PackageField from './PackageField';

class ComparisonPointField extends React.Component {
  static propTypes = {
    comparisonType: PropTypes.string,
    onComparisonPointSelected: PropTypes.func.isRequired
  }

  render() {
    const {
      comparisonType,
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
        onPackageSelected={onComparisonPointSelected}
        {...rest}
      />
    );
  }
}

export default ComparisonPointField;
