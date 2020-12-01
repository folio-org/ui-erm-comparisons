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
import { AppIcon, TitleManager, withStripes } from '@folio/stripes/core';

import { ComparisonInfo, ComparisonPoints } from '../ComparisonSections';

import Logs from '../Logs';

class ComparisonView extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      comparison: PropTypes.object,
      comparisonPointData: PropTypes.arrayOf(PropTypes.object)
    }),
    handlers: PropTypes.shape({
      onExportReportAsJSON: PropTypes.func,
    }),
    isLoading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onViewReport: PropTypes.func.isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func
    })
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
    const { data: { comparison }, stripes } = this.props;
    const isComparisonNotInProgress = comparison?.status?.value !== 'in_progress';
    const buttons = [];

    if (stripes.hasPerm('ui-erm-comparisons.jobs.delete')) {
      buttons.push(
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
      );
    }

    if (stripes.hasPerm('ui-erm-comparisons.jobs.view')) {
      buttons.push(
        <Button
          buttonStyle="dropdownItem"
          id="clickable-dropdown-export-comparison-report"
          onClick={() => {
            this.props.handlers.onExportReportAsJSON();
            onToggle();
          }}
        >
          <Icon icon="download">
            <FormattedMessage id="ui-erm-comparisons.comparison.export" />
          </Icon>
        </Button>
      );
    }

    return buttons.length ? buttons : null;
  }

  render() {
    const { data: { comparison }, isLoading, onViewReport } = this.props;

    if (isLoading) return this.renderLoadingPane();
    const isComparisonEnded = comparison?.status?.value === 'ended';

    return (
      <Pane
        actionMenu={this.getActionMenu}
        appIcon={<AppIcon app="erm-comparisons" />}
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
          <ComparisonInfo comparison={comparison} onViewReport={onViewReport} />
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
            {
              isComparisonEnded ? (
                <>
                  <Logs
                    type="error"
                    {...this.getSectionProps('errorLogs')}
                  />
                  <Logs
                    type="info"
                    {...this.getSectionProps('infoLogs')}
                  />
                </>
              ) : null
            }
          </AccordionSet>
        </TitleManager>
      </Pane>
    );
  }
}

export default withStripes(ComparisonView);
