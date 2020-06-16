import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Accordion, Badge } from '@folio/stripes/components';

import ComparisonLogContainer from '../../containers/ComparisonLogContainer';

export default class LogsList extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    comparison: PropTypes.object,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    type: PropTypes.string.isRequired,
  };

  render() {
    const { id, comparison, onToggle, open, type } = this.props;

    return (
      <Accordion
        displayWhenClosed={<Badge>{comparison[`${type}LogCount`]}</Badge>}
        displayWhenOpen={<Badge>{comparison[`${type}LogCount`]}</Badge>}
        id={id}
        label={<FormattedMessage id={`ui-local-kb-admin.${type}Log`} />}
        onToggle={onToggle}
        open={open}
      >
        { open ?
          <ComparisonLogContainer
            comparison={comparison}
            type={type}
          />
          :
          <div />
        }
      </Accordion>
    );
  }
}
