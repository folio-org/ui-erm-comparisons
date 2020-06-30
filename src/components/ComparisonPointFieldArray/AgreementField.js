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

class AgreementField extends React.Component {
  static propTypes = {
    agreement: PropTypes.shape({
      endDate: PropTypes.string,
      name: PropTypes.string,
      reasonForClosure: PropTypes.string,
      startDate: PropTypes.string,
      status: PropTypes.string,
    }),
    id: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.object
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.bool,
      touched: PropTypes.bool
    }),
    onAgreementSelected: PropTypes.func.isRequired,
  }

  static defaultProps = {
    agreement: {},
  }

  componentDidMount() {
    if (!get(this.props, 'input.value') && get(this.triggerButton, 'current')) {
      this.triggerButton.current.focus();
    }
  }

  renderLinkAgreementButton = value => {
    return (
      <Pluggable
        dataKey="agreement"
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
                    data-test-ic-link-agreement
                    {...buttonProps}
                  >
                    <FormattedMessage id="ui-erm-comparisons.newComparison.replaceAgreement" />
                  </Button>
                )}
              </Tooltip>
            );
          }
          return (
            <Button
              autoFocus
              data-test-ic-link-agreement
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

  renderAgreement = () => {
    const {
      endDate,
      reasonForClosure,
      startDate,
      status
    } = this.props.agreement;

    return (
      <div data-test-agreement-card>
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.startDate" />}>
              <span data-test-agreement-start-date>
                {startDate}
              </span>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.endDate" />}>
              <span data-test-agreement-end-date>
                {endDate || <NoValue />}
              </span>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.status" />}>
              <span data-test-agreement-status>
                {status}
              </span>
            </KeyValue>
          </Col>
          {reasonForClosure &&
            <Col xs={3}>
              <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.reasonForClosure" />}>
                <span data-test-agreement-reason-for-closure>
                  {reasonForClosure}
                </span>
              </KeyValue>
            </Col>
          }
        </Row>
      </div>
    );
  }

  renderEmpty = () => (
    <div data-test-agreement-empty>
      <Layout className="textCentered">
        <strong>
          <FormattedMessage id="ui-erm-comparisons.newComparison.noAgreementLinked" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-erm-comparisons.newComparison.linkAgreementToStart" />
      </Layout>
    </div>
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
      meta: { error, touched }
    } = this.props;

    // If no agreement has been selected, then the passed agreement will be {}. We want that to be null
    let agreement = null;
    if (this.props.agreement?.id) {
      agreement = this.props.agreement;
    }

    return (
      <Card
        cardStyle={agreement ? 'positive' : 'negative'}
        headerEnd={this.renderLinkAgreementButton(agreement)}
        headerStart={
          <AppIcon app="agreements" size="small">
            <strong>
              {agreement ?
                <Link
                  data-test-agreement-name-link
                  to={`/erm/agreements/${agreement.id}`}
                >
                  {agreement.name}
                </Link> :
                <FormattedMessage id="ui-erm-comparisons.newComparison.agreement" />
              }
            </strong>
          </AppIcon>
        }
        id={id}
        roundedBorder
      >
        {agreement ? this.renderAgreement() : this.renderEmpty()}
        {touched && error ? this.renderError() : null}
      </Card>
    );
  }
}

export default AgreementField;
