import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  Button,
  HasCommand,
  IconButton,
  Layout,
  MessageBanner,
  Pane,
  Paneset,
  PaneFooter,
  PaneMenu,
  TextField,
  checkScope
} from '@folio/stripes/components';

import { handleSaveKeyCommand, requiredValidator } from '@folio/stripes-erm-components';

import ComparisonPointFieldArray from '../../ComparisonPointFieldArray';

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
      agreements: PropTypes.arrayOf(PropTypes.object),
      packages: PropTypes.arrayOf(PropTypes.object)
    })
  }

  shouldDisableAddNew({ agreements = [], packages = [] }, comparisonLimit) {
    const agreementCount = agreements.filter(agreement => agreement._delete === false).length;
    const packagesCount = packages.filter(pkg => pkg._delete === false).length;

    return agreementCount + packagesCount === comparisonLimit;
  }

  renderPaneFooter(disableAddNew) {
    const { handlers, handleSubmit, invalid, pristine, submitting } = this.props;

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
        disabled={invalid || pristine || submitting || !disableAddNew}
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
              aria-label={ariaLabel?.[0]}
              icon="times"
              id="close-comparison-form-button"
              onClick={this.props.handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  shortcuts = [
    {
      name: 'save',
      handler: (e) => handleSaveKeyCommand(e, this.props),
    },
  ];

  render() {
    const { data: { entitlements }, values } = this.props;
    const comparisonLimit = 2;
    const disableAddNew = this.shouldDisableAddNew(values, comparisonLimit);

    return (
      <HasCommand
        commands={this.shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <FormattedMessage id="ui-erm-comparisons.create">
            {create => (
              <Pane
                appIcon={<AppIcon app="erm-comparisons" />}
                centerContent
                defaultWidth="100%"
                firstMenu={this.renderFirstMenu()}
                footer={this.renderPaneFooter(disableAddNew)}
                id="pane-comparison-form"
                paneTitle={<FormattedMessage id="ui-erm-comparisons.comparison.newComparison" />}
              >
                <Layout className="padding-top-gutter padding-bottom-gutter">
                  <MessageBanner>
                    <FormattedMessage id="ui-erm-comparisons.newComparison.info" />
                  </MessageBanner>
                </Layout>
                <TitleManager record={create?.[0]}>
                  <form>
                    <Layout className="padding-top-gutter">
                      <Field
                        autoFocus
                        component={TextField}
                        data-test-field-comparison-name
                        label={<FormattedMessage id="ui-erm-comparisons.newComparison.name" />}
                        name="name"
                        required
                        validate={requiredValidator}
                      />
                    </Layout>
                    <Layout className="padding-bottom-gutter">
                      <FieldArray
                        addButtonId="data-test-add-package-button"
                        addLabelId="ui-erm-comparisons.newComparison.addPackage"
                        comparisonPoint="package"
                        component={ComparisonPointFieldArray}
                        data={{ entitlements }}
                        data-test-field-array-packages
                        deleteButtonTooltipId="ui-erm-comparisons.newComparison.removePackage"
                        disableAddNew={disableAddNew}
                        handlers={{
                          onEResourceAdded: (id) => this.props.handlers.onEResourceAdded(id),
                          onEResourceRemoved: (id) => this.props.handlers.onEResourceRemoved(id)
                        }}
                        headerId="ui-erm-comparisons.newComparison.packageTitle"
                        id="comparison-point-form-packages"
                        name="packages"
                      />
                    </Layout>
                    <Layout className="padding-bottom-gutter">
                      <FieldArray
                        addButtonId="data-test-add-agreement-button"
                        addLabelId="ui-erm-comparisons.newComparison.addAgreement"
                        comparisonPoint="agreement"
                        component={ComparisonPointFieldArray}
                        data-test-field-array-agreements
                        deleteButtonTooltipId="ui-erm-comparisons.newComparison.removeAgreement"
                        disableAddNew={disableAddNew}
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
      </HasCommand>
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
