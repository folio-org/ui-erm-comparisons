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

import css from './styles.css';

class PackageField extends React.Component {
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
        disableRecordCreation
        onPackageSelected={this.props.onPackageSelected}
        renderTrigger={(props) => {
          this.triggerButton = props.buttonRef;
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonStyle': value ? 'default' : 'primary',
            'id': `${this.props.id}-search-button`,
            'name': this.props.input.name,
            'onClick': props.onClick,
            'buttonRef': this.triggerButton,
            'marginBottom0': true
          };
          if (value) {
            return (
              <Tooltip
                id={`${this.props.id}-package-button-tooltip`}
                text={<FormattedMessage id="ui-erm-comparisons.newComparison.replacePackageSpecific" values={{ package: this.props.package.name }} />}
                triggerRef={this.triggerButton}
              >
                {({ ariaIds }) => (
                  <Button
                    aria-labelledby={ariaIds.text}
                    data-test-ic-link-user
                    {...buttonProps}
                  >
                    <FormattedMessage id="ui-erm-comparisons.newComparison.replacePackage" />
                  </Button>
                )}
              </Tooltip>
            );
          }
          return (
            <Button
              data-test-ic-link-package
              {...buttonProps}
            >
              <FormattedMessage id="ui-erm-comparisons.newComparison.addPackage" />
            </Button>
          );
        }}
        type="find-eresource"
      >
        <FormattedMessage id="ui-erm-comparisons.newComparison.noPackagePlugin" />
      </Pluggable>
    );
  }

  renderPackage = () => {
    const {
      count,
      type,
      provider
    } = this.props.package;

    return (
      <div data-test-package-card>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.count" />}>
              <span data-test-package-count>
                {count || <NoValue />}
              </span>
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.type" />}>
              <span data-test-package-type>
                {type || <NoValue />}
              </span>
            </KeyValue>
          </Col>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.provider" />}>
              <span data-test-package-provider>
                {provider}
              </span>
            </KeyValue>
          </Col>
        </Row>
      </div>
    );
  }

  renderEmpty = () => (
    <div data-test-user-empty>
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

  renderError = () => (
    <Layout className={`textCentered ${css.error}`} data-test-package-error>
      <strong>
        {this.props.meta.error}
      </strong>
    </Layout>
  )

  render() {
    const {
      id,
      input: { value },
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
          <AppIcon app="agreements" size="small">
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
