import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Icon,
  NoValue,
  Tooltip,
} from '@folio/stripes/components';

const PlatformTitleLink = ({ id, platform, title, url }) => {
  if (!platform && !url) return <NoValue />;

  return (
    <div>
      <div data-test-platform>{platform ?? null}</div>
      { url ? (
        <Tooltip
          id={`pti-link-tooltip-${id}`}
          placement="bottom"
          text={<FormattedMessage
            id="ui-erm-comparisons.comparisonReport.accessTitleOnPlatform"
            values={{ platform, title }}
          />}
        >
          {({ ref, ariaIds }) => (
            <div
              ref={ref}
              aria-labelledby={ariaIds.text}
            >
              <a
                href={url}
                onClick={e => e.stopPropagation()}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon icon="external-link" iconPosition="end">
                  <FormattedMessage id="ui-erm-comparisons.comparisonReport.titleOnPlatform" />
                </Icon>
              </a>
            </div>
          )}
        </Tooltip>) : null
        }
    </div>
  );
};

PlatformTitleLink.propTypes = {
  id: PropTypes.string,
  platform: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
};

export default PlatformTitleLink;
