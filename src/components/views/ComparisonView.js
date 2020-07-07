import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  Layout,
  Pane,
  Row,
  Spinner
} from '@folio/stripes/components';
import { IfPermission, TitleManager } from '@folio/stripes/core';

import { ComparisonInfo, ComparisonPoints } from '../ComparisonSections';

import Logs from '../Logs';

export default class ComparisonView extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      comparison: PropTypes.object,
      comparisonPointData: PropTypes.arrayOf(PropTypes.object)
    }),
    isLoading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onViewReport: PropTypes.func.isRequired
  };

  state = {
    sections: {
      comparisonPoints: false,
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
        paneTitle={<FormattedMessage id="ui-erm-comparisons.loading" />}
      >
        <Layout className="marginTop1">
          <Spinner />
        </Layout>
      </Pane>
    );
  }

  getSectionProps = (id) => {
    const { data: { comparison, comparisonPointData } } = this.props;
    return {
      id,
      comparison,
      comparisonPointData,
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
            <FormattedMessage id="ui-erm-comparisons.comparison.delete" />
          </Icon>
        </Button>
      </IfPermission>
    );
  }

  render() {
    const { data: { comparison }, isLoading, onViewReport } = this.props;
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
          <ComparisonInfo {...{ comparison, isComparisonNotQueued, onViewReport }} />
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
                <ComparisonPoints {...this.getSectionProps('comparisonPoints')} />
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
