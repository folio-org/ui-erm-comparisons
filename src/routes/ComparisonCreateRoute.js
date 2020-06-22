import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

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

  returnIdAndOnDate(valuesArray) {
    const newValues = [];
    valuesArray.forEach(obj => {
      newValues.push({ id: obj.id, onDate: obj.onDate });
    });
    return newValues;
  }

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`/erm-comparisons${location.search}`);
  }

  handleSubmit = (comparison) => {
    const submitValues = cloneDeep(comparison);

    if (submitValues.agreements) {
      submitValues.agreements = this.returnIdAndOnDate(submitValues.agreements);
    }
    if (submitValues.packages) {
      submitValues.packages = this.returnIdAndOnDate(submitValues.packages);
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
