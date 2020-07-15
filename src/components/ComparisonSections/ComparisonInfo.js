import React from 'react';
import PropTypes from 'prop-types';


import {
  Button,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { FormattedMessage } from 'react-intl';
import FormattedDateTime from '../FormattedDateTime';


export default class ComparisonInfo extends React.Component {
  static propTypes = {
    comparison: PropTypes.object.isRequired,
    isComparisonNotQueued: PropTypes.bool.isRequired,
    onViewReport: PropTypes.func.isRequired
  };

  render() {
    const { comparison, isComparisonNotQueued, onViewReport } = this.props;
    return (
      <div>
        <Row>
          <Col xs={9}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.prop.comparisonName" />}>
              <div data-test-comparison-name>
                <strong>{comparison.name}</strong>
              </div>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.prop.runningStatus" />}>
              <div data-test-comparison-status>
                {comparison?.status?.label ?? <NoValue />}
              </div>
            </KeyValue>
          </Col>
          {
            isComparisonNotQueued && (
              <Col xs={4}>
                <KeyValue label={<FormattedMessage id="ui-erm-comparisons.prop.outcome" />}>
                  <div data-test-comparison-result>
                    {comparison?.result?.label ?? <NoValue />}
                  </div>
                </KeyValue>
              </Col>
            )
          }
          {
            isComparisonNotQueued && (
              <Col xs={4}>
                <KeyValue label={<FormattedMessage id="ui-erm-comparisons.prop.errors" />}>
                  <div data-test-comparison-errors>
                    {comparison.errorLog ? comparison.errorLog?.length : '0'}
                  </div>
                </KeyValue>
              </Col>
            )
          }
        </Row>
        <Row>
          {
            isComparisonNotQueued && (
              <Col xs={4}>
                <KeyValue label={<FormattedMessage id="ui-erm-comparisons.prop.started" />}>
                  <div data-test-comparison-started>
                    {comparison.started ? <FormattedDateTime date={comparison.started} /> : <NoValue />}
                  </div>
                </KeyValue>
              </Col>
            )
          }
          {
            isComparisonNotQueued && (
              <Col xs={4}>
                <KeyValue label={<FormattedMessage id="ui-erm-comparisons.prop.ended" />}>
                  <div data-test-comparison-ended>
                    {comparison.ended ? <FormattedDateTime date={comparison.ended} /> : <NoValue />}
                  </div>
                </KeyValue>
              </Col>
            )
          }
        </Row>
        <Row>
          <Button
            buttonStyle="primary mega"
            data-test-comparison-report-view
            marginBottom0
            onClick={onViewReport}
          >
            <FormattedMessage id="ui-erm-comparisons.prop.viewReport" />
          </Button>
        </Row>
      </div>
    );
  }
}
