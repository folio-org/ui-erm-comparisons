import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Accordion,
  Badge,
} from '@folio/stripes/components';
import { Registry } from '@folio/handler-stripes-registry';
import { FormattedMessage } from 'react-intl';

export default class ComparisonPoints extends React.Component {
  static propTypes = {
    comparison: PropTypes.shape({
      comparisonPoints: PropTypes.arrayOf(PropTypes.shape({
        titleList: PropTypes.shape({
          name: PropTypes.string.isRequired
        })
      })),
    }).isRequired,
    id: PropTypes.string.isRequired
  };

  render() {
    const { comparison: { comparisonPoints = [] }, id } = this.props;

    return (
      <Accordion
        displayWhenClosed={<Badge>{comparisonPoints?.length}</Badge>}
        displayWhenOpen={<Badge>{comparisonPoints?.length}</Badge>}
        id={id}
        label={<FormattedMessage id="ui-erm-comparisons.prop.comparisonPoints" />}
      >
        <ul
          data-test-comparison-points-list
        >
          {comparisonPoints?.map((cp, index) => {
            let resourceType = 'agreement';
            if (cp.titleList.class.toLowerCase() === 'org.olf.kb.pkg') {
              resourceType = 'ermPackage';
            }
            const resourceLink = Registry.getResource(resourceType)?.getViewResource();
            return (
              <li
                key={`comparison-point${index}`}
                id="comparison-point"
              >
                <div data-test-comparison-point-name>
                  <Link to={resourceLink(cp.titleList)}>
                    {cp.titleList.name}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </Accordion>
    );
  }
}
