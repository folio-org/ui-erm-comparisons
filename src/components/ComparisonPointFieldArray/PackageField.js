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
  }

  componentDidMount() {
    if (!get(this.props, 'input.value') && get(this.triggerButton, 'current')) {
      this.triggerButton.current.focus();
    }
  }

  renderLinkPackageButton = value => {
    const {
      id,
      input: { name },
      onPackageSelected
    } = this.props;

    return (
      <Pluggable
        dataKey="package"
        onEresourceSelected={onPackageSelected}
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonRef': this.triggerButton,
            'buttonStyle': value ? 'default' : 'primary',
            'id': `${id}-search-button`,
            'name': name,
            'onClick': props.onClick,
            'marginBottom0': true
          };

          return value ? (
            <Tooltip
              id={`${id}-package-button-tooltip`}
              text={<FormattedMessage id="ui-erm-comparisons.newComparison.replacePackageSpecific" values={{ package: value.name }} />}
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
    const {
      entitlements,
      input: { value: { id } }
    } = this.props;

    const relevantEntitlements = entitlements?.[id] ?? [];

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
    const { input: { value: { count, provider } } } = this.props;

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
      meta: { error, touched },
      input: { value },
    } = this.props;

    return (
      <Card
        cardStyle={value ? 'positive' : 'negative'}
        headerEnd={this.renderLinkPackageButton(value)}
        headerStart={
          <AppIcon app="erm-comparisons" iconKey="eresource" size="small">
            <strong>
              {value ?
                (
                  <Link
                    data-test-package-name-link
                    to={`/erm/eresources/${value.id}`}
                  >
                    {value.name}
                  </Link>
                ) : <FormattedMessage id="ui-erm-comparisons.newComparison.package" />
              }
            </strong>
          </AppIcon>
        }
        id={id}
        roundedBorder
      >
        {value ? this.renderPackage() : this.renderEmpty()}
        {touched && error ? this.renderError() : null}
      </Card>
    );
  }
}

export default PackageField;
