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
    agreement: PropTypes.shape({
      comparisonPoint: PropTypes.shape({
        endDate: PropTypes.string,
        name: PropTypes.string,
        reasonForClosure: PropTypes.string,
        startDate: PropTypes.string,
        status: PropTypes.string,
      })
    }),
    id: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.object
    }).isRequired,
    meta: PropTypes.shape({
      error: PropTypes.object,
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
    const { agreement: { comparisonPoint: { name: cpName } }, id, input: { name }, onAgreementSelected } = this.props;
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
                text={<FormattedMessage id="ui-erm-comparisons.newComparison.replaceAgreementSpecific" values={{ agreement: cpName }} />}
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
    const { agreement: { comparisonPoint: {
      endDate,
      reasonForClosure,
      startDate,
      status
    } } } = this.props;

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
      agreement: { comparisonPoint },
      id,
      meta: { error, touched }
    } = this.props;

    // If no agreement has been selected, then the passed agreement will be {}. We want that to be null
    let agreement = null;
    if (comparisonPoint?.id) {
      agreement = comparisonPoint;
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
