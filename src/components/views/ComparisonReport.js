import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import {
  Button,
  IconButton,
  Layout,
  LoadingPane,
  Pane,
  PaneMenu,
  Paneset
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import ComparisonReportList from './ComparisonReportList';

const resourceCount = 100;
const ComparisonReport = ({ data, isLoading, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(resourceCount);

  const renderFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-erm-comparisons.report.close">
          {ariaLabel => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="close-report-button"
              onClick={onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  const handleNeedMoreData = () => {
    setCurrentIndex(currentIndex + resourceCount);
  };

  const paneProps = {
    defaultWidth: 'fill',
    id: 'pane-report',
    onClose,
  };

  if (isLoading) return <LoadingPane data-loading {...paneProps} />;

  const { comparisonPointData } = data;
  const currentResources = data?.report?.slice(0, currentIndex);
  const totalCount = data?.report?.length ?? 0;

  return (
    <Paneset>
      <Pane
        appIcon={<AppIcon app="erm-comparisons" />}
        firstMenu={renderFirstMenu()}
        paneTitle={comparisonPointData?.name}
        {...paneProps}
      >
        <div>
          <ComparisonReportList
            sourceData={{ comparisonPointData, report: currentResources }}
            totalCount={totalCount}
          />
          {
            currentResources.length < totalCount && (
              <Layout className="marginTop1 textCentered">
                <Button
                  onClick={handleNeedMoreData}
                  style={{ width: '75%' }}
                >
                  <FormattedMessage id="ui-erm-comparisons.comparisonReport.loadMore" />
                </Button>
              </Layout>
            )
          }
        </div>
      </Pane>
    </Paneset>
  );
};

ComparisonReport.propTypes = {
  data: PropTypes.shape({
    comparisonPointData: PropTypes.object,
  }),
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export default ComparisonReport;


