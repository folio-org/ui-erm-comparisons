import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Registry } from '@folio/handler-stripes-registry';

import {
  Button,
  Card,
  Col,
  KeyValue,
  Layout,
  NoValue,
  Row,
  Spinner,
  Tooltip
} from '@folio/stripes/components';
import { AppIcon, Pluggable } from '@folio/stripes/core';

import { useParallelBatchFetch } from '@folio/stripes-erm-components';

import EntitlementAgreementsList from '../EntitlementsAgreementsList';

import css from './styles.css';
import { RESOURCE_ENTITLEMENTS_ENDPOINT } from '../../constants/endpoints';

const PackageField = ({
  id,
  input: {
    name,
    value
  },
  meta: { error, touched },
  onPackageSelected
}) => {
  // Hold triggerRef here to allow us to focus on it later
  let triggerButton;

  useEffect(() => {
    if (!value && triggerButton?.current) {
      triggerButton.current.focus();
    }
  }, [triggerButton, value]);

  const getResourceLink = (inputValue) => {
    const resourceLink = Registry.getResource('ermPackage')?.getViewResource();
    return resourceLink ? resourceLink(inputValue) : undefined;
  };

  // BATCHED FETCH ENTITLEMENTS
  const {
    items: entitlements,
    total: entitlementCount,
    isLoading: areEntitlementsLoading
  } = useParallelBatchFetch({
    generateQueryKey: ({ offset }) => ['ERM', 'Eresource', value?.id, 'Entitlements', RESOURCE_ENTITLEMENTS_ENDPOINT(value?.id), offset],
    endpoint: RESOURCE_ENTITLEMENTS_ENDPOINT(value?.id),
    queryParams: {
      enabled: !!value?.id
    }
  });

  const renderLinkPackageButton = internalValue => {
    return (
      <Pluggable
        dataKey="package"
        onEresourceSelected={onPackageSelected}
        renderTrigger={(props) => {
          // eslint-disable-next-line react/prop-types
          triggerButton = props.buttonRef;
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonRef': triggerButton,
            'buttonStyle': internalValue ? 'default' : 'primary',
            'id': `${id}-search-button`,
            'name': name,
            // eslint-disable-next-line react/prop-types
            'onClick': props.onClick,
            'marginBottom0': true
          };

          return internalValue ? (
            <Tooltip
              id={`${id}-package-button-tooltip`}
              text={<FormattedMessage id="ui-erm-comparisons.newComparison.replacePackageSpecific" values={{ package: internalValue.name }} />}
              triggerRef={triggerButton}
            >
              {({ ariaIds }) => (
                <Button
                  aria-labelledby={ariaIds.text}
                  data-test-link-package
                  {...buttonProps}
                >
                  <FormattedMessage id="ui-erm-comparisons.newComparison.replacePackage" />
                </Button>
              )}
            </Tooltip>
          ) : (
            <Button
              autoFocus
              data-test-link-package
              {...buttonProps}
            >
              <FormattedMessage id="ui-erm-comparisons.newComparison.linkPackage" />
            </Button>
          );
        }}
        showTitles={false}
        type="find-eresource"
      >
        <FormattedMessage id="ui-erm-comparisons.newComparison.noPackagePlugin" />
      </Pluggable>
    );
  };

  const renderEntitlementAgreements = () => {
    let renderComponent;

    if (areEntitlementsLoading || entitlementCount > entitlements?.length) {
      renderComponent = <Spinner />;
    } else {
      renderComponent = <EntitlementAgreementsList
        data-test-package-entitlements
        entitlements={entitlements}
        id="package-agreements-list"
      />;
    }

    return (
      <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.packageAgreements" />}>
        {renderComponent}
      </KeyValue>
    );
  };

  const renderPackage = () => {
    const { count, provider } = value;

    return (
      <div data-test-package-card>
        <Row>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.count" />}>
              <span data-test-package-count>
                {count || <NoValue />}
              </span>
            </KeyValue>
          </Col>
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-erm-comparisons.newComparison.provider" />}>
              <span data-test-package-provider>
                {provider}
              </span>
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {renderEntitlementAgreements()}
          </Col>
        </Row>
      </div>
    );
  };

  const renderEmpty = () => (
    <div data-test-package-empty>
      <Layout className="textCentered">
        <strong>
          <FormattedMessage id="ui-erm-comparisons.newComparison.noPackageLinked" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="ui-erm-comparisons.newComparison.linkPackageToStart" />
      </Layout>
    </div>
  );

  const renderError = () => {
    return (
      <Layout className={`textCentered ${css.error}`}>
        <strong>
          {error}
        </strong>
      </Layout>
    );
  };

  return (
    <Card
      cardStyle={value ? 'positive' : 'negative'}
      headerEnd={renderLinkPackageButton(value)}
      headerStart={
        <AppIcon app="erm-comparisons" iconKey="eresource" size="small">
          <strong>
            {value ?
              (
                <Link
                  data-test-package-name-link
                  to={getResourceLink(value)}
                >
                  {value.name}
                </Link>
              ) : <FormattedMessage id="ui-erm-comparisons.newComparison.package" />
            }
          </strong>
        </AppIcon>
      }
      id={id}
      roundedBorder
    >
      {value ? renderPackage() : renderEmpty()}
      {touched && error ? renderError() : null}
    </Card>
  );
};

PackageField.propTypes = {
  entitlements: PropTypes.object,
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
  onPackageSelected: PropTypes.func.isRequired,
};

export default PackageField;
