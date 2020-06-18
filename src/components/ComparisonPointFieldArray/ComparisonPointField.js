import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import AgreementField from './AgreementField';

class ComparisonPointField extends React.Component {
  render() {
    console.log("CPF PROPS: %o", this.props)
    const { onComparisonPointSelected, ...props } = this.props;
    return (
      <AgreementField onAgreementSelected={onComparisonPointSelected} {...props} />
    );
  }
}

export default ComparisonPointField;
