import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Accordion, Badge } from '@folio/stripes/components';

import ComparisonLogContainer from '../../containers/ComparisonLogContainer';

export default class Logs extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    comparison: PropTypes.object,
    type: PropTypes.string.isRequired,
  };

  render() {
    const { id, comparison, type } = this.props;

    return (
      <Accordion
        displayWhenClosed={<Badge>{comparison[`${type}LogCount`]}</Badge>}
        displayWhenOpen={<Badge>{comparison[`${type}LogCount`]}</Badge>}
        id={id}
        label={<FormattedMessage id={`ui-erm-comparisons.${type}Log`} />}
      >
        <ComparisonLogContainer
          comparison={comparison}
          type={type}
        />
      </Accordion>
    );
  }
}
