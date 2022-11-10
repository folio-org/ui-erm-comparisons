import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Layout } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

const ComparisonPointFilter = ({ disabled, name, onAgreementSelected, onPackageSelected }) => {
  let triggerButton = useRef(null);
  const renderFilterAgreementButton = () => {
    return (
      <div data-testid="selectAgreementPluggin">
        <Pluggable
          dataKey={`agreement-${name}`}
          onAgreementSelected={onAgreementSelected}
          renderTrigger={(pluggableRenderProps) => {
            triggerButton = pluggableRenderProps.buttonRef;
            const buttonProps = {
              'aria-haspopup': 'true',
              'buttonRef': triggerButton,
              'id': `${name}-agreement-search-button`,
              'onClick': pluggableRenderProps.onClick,
            };
            return (
              <Button
                key={`data-test-add-${name}-agreement-filter`}
                disabled={disabled}
                {...buttonProps}
              >
                <FormattedMessage id="ui-erm-comparisons.selectAgreement" />
              </Button>
            );
          }}
          type="find-agreement"
        >
          <FormattedMessage id="ui-erm-comparisons.newComparison.noAgreementPlugin" />
        </Pluggable>
      </div>
    );
  };

  const renderFilterPackageButton = () => {
    return (
      <div data-testid="selectPackagePluggin">
        <Pluggable
          dataKey={`package-${name}`}
          onEresourceSelected={onPackageSelected}
          renderTrigger={(pluggableRenderProps) => {
            triggerButton = pluggableRenderProps.buttonRef;
            const buttonProps = {
              'aria-haspopup': 'true',
              'buttonRef': triggerButton,
              'id': `${name}-package-search-button`,
              'onClick': pluggableRenderProps.onClick,
            };
            return (
              <Button
                key={`data-test-add-${name}-package-filter`}
                disabled={disabled}
                {...buttonProps}
              >
                <FormattedMessage id="ui-erm-comparisons.selectPackage" />
              </Button>
            );
          }}
          showTitles={false}
          type="find-eresource"
        >
          <FormattedMessage id="ui-erm-comparisons.newComparison.noPackagePlugin" />
        </Pluggable>
      </div>
    );
  };

  return (
    <>
      <Layout className="flex-direction-column">
        {renderFilterAgreementButton()}
        {renderFilterPackageButton()}
      </Layout>
    </>
  );
};

ComparisonPointFilter.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onAgreementSelected: PropTypes.func.isRequired,
  onPackageSelected: PropTypes.func.isRequired,
};

export default ComparisonPointFilter;
