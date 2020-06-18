import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  KeyValue,
  Layout,
  NoValue,
  Pane,
  Row,
  Spinner
} from '@folio/stripes/components';
import { IfPermission, TitleManager } from '@folio/stripes/core';

import Logs from '../Logs';
import FormattedDateTime from '../FormattedDateTime';

export default class ComparisonInfo extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      comparison: PropTypes.object,
    }),
    isLoading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
  };

  state = {
    sections: {
      errorLogs: false,
      infoLogs: false,
    }
  }

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="45%"
        dismissible
        id="pane-view-comparison"
        onClose={this.props.onClose}
        paneTitle={<FormattedMessage id="ui-erm-comparisonss.loading" />}
      >
        <Layout className="marginTop1">
          <Spinner />
        </Layout>
      </Pane>
    );
  }

  getSectionProps = (id) => {
    const { data: { comparison } } = this.props;
    return {
      id,
      comparison,
      onToggle: this.handleSectionToggle,
      open: this.state.sections[id],
    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((prevState) => ({
      sections: {
        ...prevState.sections,
        [id]: !prevState.sections[id],
      }
    }));
  }

  handleAllSectionsToggle = (sections) => {
    this.setState({ sections });
  }

  getActionMenu = ({ onToggle }) => {
    const { data: { comparison } } = this.props;
    const isComparisonNotInProgress = comparison?.status?.value !== 'in_progress';

    return (
      <IfPermission perm="ui-local-kb-admin.jobs.delete">
        <Button
          buttonStyle="dropdownItem"
          disabled={!isComparisonNotInProgress}
          id="clickable-dropdown-delete-comparison"
          onClick={() => {
            onToggle();
            this.props.onDelete();
          }}
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-erm-comparisonss.comparison.delete" />
          </Icon>
        </Button>
      </IfPermission>
    );
  }

  render() {
    const { data: { comparison }, isLoading } = this.props;

    if (isLoading) return this.renderLoadingPane();
    const isComparisonNotQueued = comparison?.status?.value !== 'queued';

    return (
      <Pane
        actionMenu={this.getActionMenu}
        data-test-comparison-details
        defaultWidth="45%"
        dismissible
        id="pane-view-comparison"
        onClose={this.props.onClose}
        paneTitle={
          <span data-test-header-title>
            {comparison.name}
          </span>
        }
      >
        <TitleManager data-test-title-name record={comparison.name}>
          <div>
            <Row>
              <Col xs={9}>
                <KeyValue label={<FormattedMessage id="ui-erm-comparisonss.prop.comparisonName" />}>
                  <div data-test-comparison-name>
                    <strong>{comparison.name}</strong>
                  </div>
                </KeyValue>
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <KeyValue label={<FormattedMessage id="ui-erm-comparisonss.prop.runningStatus" />}>
                  <div data-test-comparison-status>
                    {comparison?.status?.label ?? <NoValue />}
                  </div>
                </KeyValue>
              </Col>
              {
                isComparisonNotQueued && (
                  <Col xs={4}>
                    <KeyValue label={<FormattedMessage id="ui-erm-comparisonss.prop.outcome" />}>
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
                    <KeyValue label={<FormattedMessage id="ui-erm-comparisonss.prop.errors" />}>
                      <div data-test-comparison-errors>
                        {comparison.errorLog ? comparison.errorLog.length : '0'}
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
                    <KeyValue label={<FormattedMessage id="ui-erm-comparisonss.prop.started" />}>
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
                    <KeyValue label={<FormattedMessage id="ui-erm-comparisonss.prop.ended" />}>
                      <div data-test-comparison-ended>
                        {comparison.ended ? <FormattedDateTime date={comparison.ended} /> : <NoValue />}
                      </div>
                    </KeyValue>
                  </Col>
                )
              }
            </Row>
          </div>
          {
            isComparisonNotQueued ? (
              <AccordionSet>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton
                      accordionStatus={this.state.sections}
                      id="clickable-expand-all"
                      onToggle={this.handleAllSectionsToggle}
                    />
                  </Col>
                </Row>
                <Logs
                  type="error"
                  {...this.getSectionProps('errorLogs')}
                />
                <Logs
                  type="info"
                  {...this.getSectionProps('infoLogs')}
                />
              </AccordionSet>
            ) : null
          }
        </TitleManager>
      </Pane>
    );
  }
}
