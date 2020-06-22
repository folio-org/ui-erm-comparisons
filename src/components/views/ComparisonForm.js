import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  Button,
  Col,
  IconButton,
  Layout,
  MessageBanner,
  Pane,
  Paneset,
  PaneFooter,
  PaneMenu,
  Row,
  TextField,
} from '@folio/stripes/components';

import ComparisonPointFieldArray from '../ComparisonPointFieldArray';

class ComparisonForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    pristine: PropTypes.bool,
    submitting: PropTypes.bool
  }

  state = { currentComparisons: 0 }

  static getDerivedStateFromProps(props) {
    return { currentComparisons: (props.values?.agreements?.length || 0) + (props.values?.packages?.length || 0) };
  }

  renderPaneFooter() {
    const { handlers, handleSubmit, pristine, submitting } = this.props;
    const startButton = (
      <Button
        buttonStyle="default mega"
        id="clickable-cancel"
        marginBottom0
        onClick={handlers.onClose}
      >
        <FormattedMessage id="stripes-components.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        data-test-save-button
        disabled={pristine || submitting}
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderEnd={endButton}
        renderStart={startButton}
      />
    );
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-erm-comparisons.comparison.close">
          {ariaLabel => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="close-comparison-form-button"
              onClick={this.props.handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  render() {
    return (
      <Paneset>
        <FormattedMessage id="ui-erm-comparisons.create">
          {create => (
            <Pane
              appIcon={<AppIcon app="local-kb-admin" />}
              centerContent
              defaultWidth="100%"
              firstMenu={this.renderFirstMenu()}
              footer={this.renderPaneFooter()}
              id="pane-comparison-form"
              paneTitle={<FormattedMessage id="ui-erm-comparisons.comparison.newComparison" />}
            >
              <Layout className="padding-top-gutter padding-bottom-gutter">
                <MessageBanner>
                  <FormattedMessage id="ui-erm-comparisons.newComparison.info" />
                </MessageBanner>
              </Layout>
              <TitleManager record={create}>
                <form>
                  <Layout className="padding-top-gutter padding-bottom-gutter">
                    <Field
                      component={TextField}
                      label={<FormattedMessage id="ui-erm-comparisons.newComparison.name" />}
                      name="name"
                    />
                  </Layout>
                  <Layout className="padding-top-gutter padding-bottom-gutter">
                    <FieldArray
                      addButtonId="add-package-to-comparison-button"
                      addLabelId="ui-erm-comparisons.newComparison.addPackage"
                      comparisonPoint="package"
                      component={ComparisonPointFieldArray}
                      deleteButtonTooltipId="ui-erm-comparisons.newComparison.removePackage"
                      disableAddNew={this.state.currentComparisons >= 2}
                      headerId="ui-erm-comparisons.newComparison.packageTitle"
                      id="comparison-point-form-packages"
                      name="packages"
                    />
                  </Layout>
                  <Layout className="padding-top-gutter padding-bottom-gutter">
                    <FieldArray
                      addButtonId="add-agreement-to-comparison-button"
                      addLabelId="ui-erm-comparisons.newComparison.addAgreement"
                      comparisonPoint="agreement"
                      component={ComparisonPointFieldArray}
                      deleteButtonTooltipId="ui-erm-comparisons.newComparison.removeAgreement"
                      disableAddNew={this.state.currentComparisons >= 2}
                      headerId="ui-erm-comparisons.newComparison.agreementTitle"
                      id="comparison-point-form-agreements"
                      name="agreements"
                    />
                  </Layout>
                </form>
              </TitleManager>
            </Pane>
          )}
        </FormattedMessage>
      </Paneset>
    );
  }
}

export default stripesFinalForm({
  navigationCheck: true,
  keepDirtyOnReinitialize: true,
  subscription: {
    values: true,
  },
})(ComparisonForm);
