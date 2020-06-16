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
    this.props.history.push(`/erm-comparison${location.search}`);
  }

  render() {
    const { handlers } = this.props;
    return (
      <View
        handlers={{
          ...handlers,
          onClose: this.handleClose
        }}
      />
    );
  }
}

export default stripesConnect(ComparisonCreateRoute);