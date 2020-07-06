import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  FormattedUTCDate,
  Headline,
  Layout,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

const EntitlementAgreementsList = (
  { headline,
    id,
    isEmptyMessage,
    entitlements,
    visibleColumns }
) => {
  const columnMapping = {
    name: <FormattedMessage id="ui-erm-comparisons.agreements.name" />,
    status: <FormattedMessage id="ui-erm-comparisons.agreements.agreementStatus" />,
    startDate: <FormattedMessage id="ui-erm-comparisons.agreementPeriods.periodStart" />,
    endDate: <FormattedMessage id="ui-erm-comparisons.agreementPeriods.periodEnd" />,
  };

  const columnWidths = {
    startDate: 120,
    endDate: 120,
  };

  const formatter = {
    name: e => <div data-test-agreement-name><Link to={`/erm/agreements/${e?.owner?.id}`}>{e?.owner.name}</Link></div>,
    status: e => <div data-test-agreement-status>{e?.owner?.agreementStatus?.label ?? <NoValue />}</div>,
    startDate: e => <div data-test-agreement-start-date>{e?.owner?.startDate && <FormattedUTCDate value={e?.owner?.startDate} />}</div>,
    endDate: e => <div data-test-agreement-start-date>{e?.owner?.endDate && <FormattedUTCDate value={e?.owner?.endDate} />}</div>,
  };

  const renderHeadline = () => {
    return headline ? (
      <Layout className="padding-top-gutter" data-test-eresource-name>
        <Headline margin="small" tag="h4">
          {headline}
        </Headline>
      </Layout>
    ) : null;
  };

  return (
    <div
      data-test-entitlements-table
    >
      {renderHeadline()}
      <MultiColumnList
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        contentData={entitlements}
        formatter={formatter}
        id={id}
        interactive={false}
        isEmptyMessage={isEmptyMessage}
        visibleColumns={visibleColumns}
      />
    </div>
  );
};

EntitlementAgreementsList.defaultProps = {
  isEmptyMessage: <FormattedMessage data-test-entitlements-empty-message id="ui-erm-comparisons.emptyAccordion.noAgreementsEresource" />,
  visibleColumns: ['name', 'status', 'startDate', 'endDate']
};

EntitlementAgreementsList.propTypes = {
  entitlements: PropTypes.arrayOf(PropTypes.object),
  headline: PropTypes.node,
  id: PropTypes.string,
  isEmptyMessage: PropTypes.node,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

export default EntitlementAgreementsList;
