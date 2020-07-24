import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Layout } from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

class ComparisonPointFilter extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onAgreementSelected: PropTypes.func.isRequired,
    onPackageSelected: PropTypes.func.isRequired,
  };

  renderFilterAgreementButton = () => {
    return (
      <Pluggable
        dataKey={`agreement-${this.props.name}`}
        onAgreementSelected={this.props.onAgreementSelected}
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonRef': this.triggerButton,
            'id': `${this.props.name}-agreement-search-button`,
            'onClick': props.onClick,
          };
          return (
            <Button
              key={`data-test-add-${this.props.name}-agreement-filter`}
              disabled={this.props.disabled}
              {...buttonProps}
            >
              <FormattedMessage id="ui-erm-comparisons.linkAgreement" />
            </Button>
          );
        }}
        type="find-agreement"
      >
        <FormattedMessage id="ui-erm-comparisons.newComparison.noAgreementPlugin" />
      </Pluggable>
    );
  }

  renderFilterPackageButton = () => {
    return (
      <Pluggable
        dataKey={`package-${this.props.name}`}
        onEresourceSelected={this.props.onPackageSelected}
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonRef': this.triggerButton,
            'id': `${this.props.name}-package-search-button`,
            'onClick': props.onClick,
          };
          return (
            <Button
              key={`data-test-add-${this.props.name}-package-filter`}
              disabled={this.props.disabled}
              {...buttonProps}
            >
              <FormattedMessage id="ui-erm-comparisons.linkPackage" />
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
        <Layout className="flex-direction-column">
          {this.renderFilterAgreementButton()}
          {this.renderFilterPackageButton()}
        </Layout>
      </>
    );
  }
}

export default ComparisonPointFilter;
