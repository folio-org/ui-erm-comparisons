import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import AgreementField from './AgreementField';

class ComparisonPointField extends React.Component {
  render() {
    const { comparisonPoint, onComparisonPointSelected, ...props } = this.props;
    return (
      <AgreementField agreement={comparisonPoint} onAgreementSelected={onComparisonPointSelected} {...props} />
    );
  }
}

export default ComparisonPointField;
