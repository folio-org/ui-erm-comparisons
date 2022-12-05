import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedDate } from 'react-intl';
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
    id: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string, // Final-form passes null as '' by default
        PropTypes.object
      ])
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.object,
      touched: PropTypes.bool
    }),
    onAgreementSelected: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (!get(this.props, 'input.value') && get(this.triggerButton, 'current')) {
      this.triggerButton.current.focus();
    }
  }

  renderLinkAgreementButton = value => {
    const {
      id,
      input: { name },
      onAgreementSelected
    } = this.props;

    return (
      <Pluggable
        dataKey="agreement"
        onAgreementSelected={onAgreementSelected}
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
          if (value) {
            return (
              <Tooltip
                id={`${id}-agreement-button-tooltip`}
                text={<FormattedMessage id="ui-erm-comparisons.newComparison.replaceAgreementSpecific" values={{ agreement: value.name }} />}
                triggerRef={this.triggerButton}
              >
                {({ ariaIds }) => (
                  <Button
                    aria-labelledby={ariaIds.text}
                    data-test-link-agreement
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
              data-test-link-agreement
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
    );
  }

  renderAgreement = () => {
    const { input: { value } } = this.props;

    const {
      endDate,
      reasonForClosure,
      startDate,
      status
    } = value;

    return (
      <div data-test-agreement-card>
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.startDate" />}>
              <span data-test-agreement-start-date>
                <FormattedDate value={startDate} />
              </span>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.endDate" />}>
              <span data-test-agreement-end-date>
                {endDate ? <FormattedDate value={endDate} /> : <NoValue />}
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
      input: { value },
      meta: { error }
    } = this.props;

    return (
      <Card
        cardStyle={value ? 'positive' : 'negative'}
        headerEnd={this.renderLinkAgreementButton(value)}
        headerStart={
          <AppIcon app="agreements" size="small">
            <strong>
              {value ?
                <Link
                  data-test-agreement-name-link
                  to={`/erm/agreements/${value.id}`}
                >
                  {value.name}
                </Link> :
                <FormattedMessage id="ui-erm-comparisons.newComparison.agreement" />
              }
            </strong>
          </AppIcon>
        }
        id={id}
        roundedBorder
      >
        {value ? this.renderAgreement() : this.renderEmpty()}
        {error ? this.renderError() : null}
      </Card>
    );
  }
}

export default AgreementField;
