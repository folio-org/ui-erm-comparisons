import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Button,
  Card,
  Tooltip
} from '@folio/stripes/components';
import { AppIcon, Pluggable } from '@folio/stripes/core';

import css from './styles.css';

class AgreementField extends React.Component {
  static defaultProps = {
    agreement: {},
  }

  componentDidMount() {
    if (!get(this.props, 'input.value') && get(this.triggerButton, 'current')) {
      this.triggerButton.current.focus();
    }
  }

  renderLinkAgreementButton = value => (
    <Pluggable
      dataKey="agreement"
      disableRecordCreation
      onAgreementSelected={this.props.onAgreementSelected}
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
              id={`${this.props.id}-agreement-button-tooltip`}
              text={<FormattedMessage id="ui-erm-comparisons.newComparison.replaceAgreementSpecific" values={{ agreement: this.props.agreement.name }} />}
              triggerRef={this.triggerButton}
            >
              {({ ariaIds }) => (
                <Button
                  aria-labelledby={ariaIds.text}
                  data-test-ic-link-user
                  {...buttonProps}
                >
                  <FormattedMessage id="ui-erm-comparisons.newComparison.contacts.replaceAgreement" />
                </Button>
              )}
            </Tooltip>
          );
        }
        return (
          <Button
            data-test-ic-link-agreement
            {...buttonProps}
          >
            <FormattedMessage id="ui-erm-comparisons.newComparison.linkAgreement" />
          </Button>
        );
      }}
      type="find-agreement"
    >
      <FormattedMessage id="ui-erm-comparisons.newComparison.noAgreementPlugin" />
    </Pluggable>
  )

  renderError = () => (
    <Layout className={`textCentered ${css.error}`} data-test-agreement-error>
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

    console.log("AF PROPS: %o", this.props)
    return (
      <Card
        cardStyle={value ? 'positive' : 'negative'}
        headerEnd={this.renderLinkAgreementButton(value)}
        headerStart={(
          <AppIcon app="agreements" size="small">
            <strong>
              <FormattedMessage id="ui-erm-comparisons.newComparison.agreement" />
            </strong>
          </AppIcon>
        )}
        id={id}
        roundedBorder
      >
        {value ? "Agreement here" : "No agreement"}
        {touched && error ? this.renderError() : null}
      </Card>
    );
  }
}

export default AgreementField;
