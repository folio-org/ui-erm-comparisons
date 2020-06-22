import React from 'react';
import PropTypes from 'prop-types';

import { CalloutContext, stripesConnect } from '@folio/stripes/core';
import View from '../components/views/ComparisonForm';

class ComparisonCreateRoute extends React.Component {
  static propTypes = {
    handlers: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
  };

  static contextType = CalloutContext;

  static defaultProps = {
    handlers: {},
  }


  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`/erm-comparisons${location.search}`);
  }

  handleSubmit = (comparison) => {
    const submitValues = comparison;

    if (submitValues.agreements) {
      const newAgreements = [];
      submitValues.agreements.forEach(agreement => {
        newAgreements.push({ id: agreement.id });
      });
      submitValues.agreements = newAgreements;
    }

    if (submitValues.packages) {
      const newPackages = [];
      submitValues.packages.forEach(pkg => {
        newPackages.push({ id: pkg.id });
      });
      submitValues.packages = newPackages;
    }

    console.log("Submitted: %o", submitValues);
    window.alert('This will eventually submit a new comparison');
  }

  render() {
    const { handlers } = this.props;
    return (
      <View
        handlers={{
          ...handlers,
          onClose: this.handleClose
        }}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(ComparisonCreateRoute);
