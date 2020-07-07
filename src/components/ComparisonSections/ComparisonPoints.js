import React from 'react';
import PropTypes from 'prop-types';


import {
  Accordion,
  Badge,
} from '@folio/stripes/components';

import { FormattedMessage } from 'react-intl';


export default class ComparisonInfo extends React.Component {
  static propTypes = {
    comparison: PropTypes.object.isRequired,
    comparisonPointData: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.string.isRequired
  };

  render() {
    const { comparison, comparisonPointData, id } = this.props;
    return (
      <Accordion
        displayWhenClosed={<Badge>{comparison.comparisonPoints.length}</Badge>}
        displayWhenOpen={<Badge>{comparison.comparisonPoints.length}</Badge>}
        id={id}
        label={<FormattedMessage id="ui-erm-comparisons.prop.comparisonPoints" />}
      >
        <ul
          data-test-comparison-points-list
        >
          {comparison.comparisonPoints.map((cp, index) => (
            <li
              key={`comparison-point${index}`}
              id="comparison-point"
            >
              <p
                data-test-comparison-point-name
              >
                {comparisonPointData[cp.titleList.id]?.name}
              </p>
            </li>
          ))}
        </ul>
      </Accordion>
    );
  }
}
