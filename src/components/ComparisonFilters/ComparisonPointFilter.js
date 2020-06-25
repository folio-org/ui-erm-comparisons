import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Tooltip } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

class ComparisonPointFilter extends React.Component {
  renderFilterAgreementButton = value => {
    return (
      <Pluggable
        dataKey="agreement"
        onAgreementSelected={this.props.onAgreementSelected}
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonStyle': value ? 'default' : 'primary',
            'id': `${this.props.name}-agreement-search-button`,
            'onClick': props.onClick,
            'buttonRef': this.triggerButton,
            'marginBottom0': true
          };
          return (
            <Button
              disabled={this.props.disabled}
              key={`data-test-ic-add-${this.props.name}-agreement-filter`}
              {...buttonProps}
            >
              <FormattedMessage id="ui-erm-comparisons.newComparison.addAgreement" />
            </Button>
          );
        }}
        type="find-agreement"
      >
        <FormattedMessage id="ui-erm-comparisons.newComparison.noAgreementPlugin" />
      </Pluggable>
    );
  }

  renderFilterPackageButton = value => {
    return (
      <Pluggable
        dataKey="package"
        onEresourceSelected={this.props.onPackageSelected}
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonStyle': value ? 'default' : 'primary',
            'id': `${this.props.name}-package-search-button`,
            'onClick': props.onClick,
            'buttonRef': this.triggerButton,
            'marginBottom0': true
          };
          return (
            <Button
              disabled={this.props.disabled}
              key={`data-test-ic-add-${this.props.name}-package-filter`}
              {...buttonProps}
            >
              <FormattedMessage id="ui-erm-comparisons.newComparison.addPackage" />
            </Button>
          );
        }}
        showTitles={false}
        type="find-eresource"
      >
        <FormattedMessage id="ui-erm-comparisons.newComparison.noPackagePlugin" />
      </Pluggable>
    );
  }

  render() {
    return (
      <>
        {this.renderFilterAgreementButton()}
        {this.renderFilterPackageButton()}
      </>
    );
  }
}

export default ComparisonPointFilter;
