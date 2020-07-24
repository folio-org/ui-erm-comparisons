import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Card,
  Col,
  KeyValue,
  Layout,
  NoValue,
  Row,
  Tooltip
} from '@folio/stripes/components';
import { AppIcon, Pluggable } from '@folio/stripes/core';

import EntitlementAgreementsList from '../EntitlementsAgreementsList';

import css from './styles.css';

class PackageField extends React.Component {
  static propTypes = {
    entitlements: PropTypes.object,
    id: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.object
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.object,
      touched: PropTypes.bool
    }),
    onPackageSelected: PropTypes.func.isRequired,
    package: PropTypes.shape({
      count: PropTypes.number,
      id: PropTypes.string,
      name: PropTypes.string,
      provider: PropTypes.string,
    }),
  }

  static defaultProps = {
    package: {},
  }

  componentDidMount() {
    if (!get(this.props, 'input.value') && get(this.triggerButton, 'current')) {
      this.triggerButton.current.focus();
    }
  }

  renderLinkPackageButton = value => {
    return (
      <Pluggable
        dataKey="package"
        onEresourceSelected={this.props.onPackageSelected}
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonRef': this.triggerButton,
            'buttonStyle': value ? 'default' : 'primary',
            'id': `${this.props.id}-search-button`,
            'name': this.props.input.name,
            'onClick': props.onClick,
            'marginBottom0': true
          };

          return value ? (
            <Tooltip
              id={`${this.props.id}-package-button-tooltip`}
              text={<FormattedMessage id="ui-erm-comparisons.newComparison.replacePackageSpecific" values={{ package: this.props.package.name }} />}
              triggerRef={this.triggerButton}
            >
              {({ ariaIds }) => (
                <Button
                  aria-labelledby={ariaIds.text}
                  data-test-link-package
                  {...buttonProps}
                >
                  <FormattedMessage id="ui-erm-comparisons.newComparison.replacePackage" />
                </Button>
              )}
            </Tooltip>
          ) : (
            <Button
              autoFocus
              data-test-link-package
              {...buttonProps}
            >
              <FormattedMessage id="ui-erm-comparisons.newComparison.linkPackage" />
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

  renderEntitlementAgreements = () => {
    const { entitlements, package: { id } } = this.props;
    const relevantEntitlements = entitlements[id] || [];

    return (
      <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.packageAgreements" />}>
        <EntitlementAgreementsList
          data-test-package-entitlements
          entitlements={relevantEntitlements}
          id="package-agreements-list"
        />
      </KeyValue>
    );
  }

  renderPackage = () => {
    const { package: { count, provider } } = this.props;

    return (
      <div data-test-package-card>
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.count" />}>
              <span data-test-package-count>
                {count || <NoValue />}
              </span>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.provider" />}>
              <span data-test-package-provider>
                {provider}
              </span>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {this.renderEntitlementAgreements()}
          </Col>
        </Row>
      </div>
    );
  }

  renderEmpty = () => (
    <div data-test-package-empty>
      <Layout className="textCentered">
        <strong>
          <FormattedMessage id="ui-erm-comparisons.newComparison.noPackageLinked" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-erm-comparisons.newComparison.linkPackageToStart" />
      </Layout>
    </div>
  )

  renderError = () => {
    const { meta: { error } } = this.props;
    return (
      <Layout className={`textCentered ${css.error}`}>
        <strong>
          {error}
        </strong>
      </Layout>
    );
  }

  render() {
    const {
      id,
      meta: { error, touched }
    } = this.props;


    // If no package has been selected, then the passed package will be {}. We want that to be null
    let pkg = null;
    if (this.props.package?.id) {
      pkg = this.props.package;
    }

    return (
      <Card
        cardStyle={pkg ? 'positive' : 'negative'}
        headerEnd={this.renderLinkPackageButton(pkg)}
        headerStart={
          <AppIcon app="erm-comparisons" iconKey="eresource" size="small">
            <strong>
              {pkg ?
                <Link
                  data-test-package-name-link
                  to={`/erm/eresources/${pkg.id}`}
                >
                  {pkg.name}
                </Link> :
                <FormattedMessage id="ui-erm-comparisons.newComparison.package" />
              }
            </strong>
          </AppIcon>
        }
        id={id}
        roundedBorder
      >
        {pkg ? this.renderPackage() : this.renderEmpty()}
        {touched && error ? this.renderError() : null}
      </Card>
    );
  }
}

export default PackageField;
