import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  Button,
  IconButton,
  Layout,
  MessageBanner,
  Pane,
  Paneset,
  PaneFooter,
  PaneMenu,
  TextField,
} from '@folio/stripes/components';

import { requiredValidator } from '@folio/stripes-erm-components';

import ComparisonPointFieldArray from '../ComparisonPointFieldArray';

class ComparisonForm extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      entitlements: PropTypes.object
    }),
    handleSubmit: PropTypes.func.isRequired,
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onEResourceAdded: PropTypes.func.isRequired,
      onEResourceRemoved: PropTypes.func.isRequired
    }),
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    values: PropTypes.shape({
      agreements: PropTypes.shape({
        length: PropTypes.number
      }),
      packages: PropTypes.shape({
        length: PropTypes.number
      })
    })
  }

  renderPaneFooter() {
    const { handlers, handleSubmit, invalid, pristine, submitting, values } = this.props;
    const currentComparisons = (values?.agreements?.length || 0) + (values?.packages?.length || 0);
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
        disabled={invalid || pristine || submitting || currentComparisons < 2}
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
    const { data: { entitlements }, values } = this.props;
    const currentComparisons = (values?.agreements?.length || 0) + (values?.packages?.length || 0);
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
                      required
                      validate={requiredValidator}
                    />
                  </Layout>
                  <Layout className="padding-top-gutter padding-bottom-gutter">
                    <FieldArray
                      addButtonId="add-package-to-comparison-button"
                      addLabelId="ui-erm-comparisons.newComparison.addPackage"
                      comparisonPoint="package"
                      component={ComparisonPointFieldArray}
                      data={{ entitlements }}
                      deleteButtonTooltipId="ui-erm-comparisons.newComparison.removePackage"
                      disableAddNew={currentComparisons >= 2}
                      handlers={{
                        onEResourceAdded: (id) => this.props.handlers.onEResourceAdded(id),
                        onEResourceRemoved: (id) => this.props.handlers.onEResourceRemoved(id)
                      }}
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
                      disableAddNew={currentComparisons >= 2}
                      handlers={{
                        onEResourceAdded: (id) => this.props.handlers.onEResourceAdded(id),
                        onEResourceRemoved: (id) => this.props.handlers.onEResourceRemoved(id)
                      }}
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
    name: true,
    values: true,
  },
})(ComparisonForm);
