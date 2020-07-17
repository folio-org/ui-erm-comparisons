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

  const renderIdentifier = (identifierType) => (
    <div>
      <strong>
        <FormattedMessage id={`ui-erm-comparisons.comparisonReport.info.${identifierType}`} />
      </strong>
      :
      &nbsp;
      {getResourceIdentifier(titleInstance, identifierType) ?? <NoValue />}
    </div>
  );

  return (
    <Layout className="display-flex flex-direction-column">
      {renderType()}
      {renderSubType()}
      {renderIdentifier('ezb')}
      {renderIdentifier('zdb')}
      {renderIdentifier('eissn')}
    </Layout>
  );
};

TitleInfoPopover.propTypes = {
  titleInstance: PropTypes.object
};

export default TitleInfoPopover;
