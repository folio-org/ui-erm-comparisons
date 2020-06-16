import React from 'react';
import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes/core';

import ComparisonLogContainer from './ComparisonLogContainer';

class ComparisonLogContainerWrapper extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }),
    type: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.connectedComparisonLogContainer = props.stripes.connect(
      ComparisonLogContainer,
      { dataKey: props.type }
    );
  }

  render() {
    return <this.connectedComparisonLogContainer {...this.props} />;
  }
}

export default withStripes(ComparisonLogContainerWrapper);
