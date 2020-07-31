import React from 'react';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import {
  FormattedUTCDate,
  Icon,
  Layout,
  Tooltip,
} from '@folio/stripes/components';

import { resourceClasses } from '../../constants';

const getResourceProperties = (resource = {}) => {
  const { titleList } = resource;
  const type = titleList?.class === resourceClasses.PACKAGE ?
    <FormattedMessage id="ui-erm-comparisons.package" />
    :
    <FormattedMessage id="ui-erm-comparisons.agreement" />;

  return {
    id: resource.id,
    type,
    date: resource?.date,
    name: titleList?.name
  };
};

const getResourceColumnHeader = (resource) => {
  const { date, name, type } = getResourceProperties(resource);

  return (
    <SafeHTMLMessage
      id="ui-erm-comparisons.comparisonReport.type"
      tagName="div"
      values={{ date: <FormattedUTCDate value={date} />, name, type }}
    />
  );
};

const getResourceOccurrence = (coverage, resource) => {
  const {
    date,
    id: resourceId,
    name,
    type
  } = resource;

  const { occurrences, id } = coverage;
  const isResourceInPackage = occurrences[resourceId] === true;
  const icon = isResourceInPackage ? 'check-circle' : 'times-circle-solid';
  const status = isResourceInPackage ? 'success' : 'error';
  const toolTipId = isResourceInPackage ? `is-present-tooltip-${id}` : `is-not-present-tooltip-${id}`;
  const translationKey = isResourceInPackage ? 'isPresent' : 'isNotPresent';

  return (
    <Tooltip
      id={toolTipId}
      text={<FormattedMessage
        id={`ui-erm-comparisons.comparisonReport.${translationKey}`}
        values={{ date: <FormattedUTCDate value={date} />, name, type }}
      />}
    >
      {({ ref, ariaIds }) => (
        <Layout className="centered">
          <div
            ref={ref}
            aria-labelledby={ariaIds.text}
          >
            <Icon icon={icon} size="large" status={status} />
          </div>
        </Layout>
      )}
    </Tooltip>
  );
};

export { getResourceProperties, getResourceColumnHeader, getResourceOccurrence };
