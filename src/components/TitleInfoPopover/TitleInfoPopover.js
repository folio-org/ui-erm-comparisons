import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Layout, NoValue } from '@folio/stripes/components';
import { getResourceIdentifier } from '@folio/stripes-erm-components';

const TitleInfoPopover = ({ titleInstance }) => {
  const { type, subType } = titleInstance;

  const renderType = () => (
    <div>
      <strong>
        <FormattedMessage id="ui-erm-comparisons.comparisonReport.info.type" />
      </strong>
      :
      &nbsp;
      {type?.label ?? <NoValue />}
    </div>
  );

  const renderSubType = () => (
    <div>
      <strong>
        <FormattedMessage id="ui-erm-comparisons.comparisonReport.info.resourceType" />
      </strong>
      :
      &nbsp;
      {subType?.label ?? <NoValue />}
    </div>
  );

  const renderIdentifier = (identifierType) => {
    const identifier = getResourceIdentifier(titleInstance, identifierType);
    return identifier ?
      (
        <div>
          <strong>
            <FormattedMessage id={`ui-erm-comparisons.comparisonReport.info.${identifierType}`} />
          </strong>
          :
          &nbsp;
          {identifier}
        </div>
      ) : null;
  };

  return (
    <Layout className="display-flex flex-direction-column">
      {renderType()}
      {renderSubType()}
      {renderIdentifier('ezb')}
      {renderIdentifier('zdb')}
      {renderIdentifier('eissn')}
      {renderIdentifier('issn')}
      {renderIdentifier('isbn')}
      {renderIdentifier('eisbn')}
    </Layout>
  );
};

TitleInfoPopover.propTypes = {
  titleInstance: PropTypes.object
};

export default TitleInfoPopover;
