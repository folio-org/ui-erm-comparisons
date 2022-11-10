import React from 'react';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { KeyValue } from '@folio/stripes-testing';
import { StaticRouter as Router } from 'react-router-dom';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { packageFieldData, emptyPackageField, packageFieldError } from './testResources';
import PackageField from './PackageField';

const onComparisonPointSelected = jest.fn();
const onSubmit = jest.fn();

let renderComponent;
describe('PackageField', () => {
  describe('PackageField selected agreement', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmit}>
            <PackageField
              {...packageFieldData}
              onPackageSelected={onComparisonPointSelected}
            />
          </TestForm>
        </Router>, translationsProperties
      );
    });

    it('renders package title', () => {
      const { getByText } = renderComponent;
      expect(getByText('ACM Digtal Library')).toBeInTheDocument();
    });

    test('renders a link to the package', async () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'ACM Digtal Library' })).toBeInTheDocument();
    });

    test('renders the Count key value with expected value', async () => {
      await KeyValue('Count').has({ value: '10650' });
    });

    test('renders the Provider key value with expected value', async () => {
      await KeyValue('Provider').has({ value: 'Association for Computing Machinery' });
    });

    test('renders the Agreements for this package key value with expected value', async () => {
      await KeyValue('Agreements for this package').has({ value: 'No agreements for this e-resource' });
    });

    it('renders no plugin', () => {
      const { getByText } = renderComponent;
      expect(getByText('No "find-package" plugin is installed')).toBeInTheDocument();
    });
  });

  describe('empty PackageField', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmit}>
            <PackageField
              {...emptyPackageField}
              onPackageSelected={onComparisonPointSelected}
            />
          </TestForm>
        </Router>, translationsProperties
      );
    });

    it('renders package title', () => {
      const { getByText } = renderComponent;
      expect(getByText('Package')).toBeInTheDocument();
    });

    it('renders the expected No package linked layout', () => {
      const { getByText } = renderComponent;
      expect(getByText('No package linked')).toBeInTheDocument();
    });

    it('renders the expected layout', () => {
      const { getByText } = renderComponent;
      expect(getByText('Link a package to get started')).toBeInTheDocument();
    });
  });

  describe('PackageField with error', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmit}>
            <PackageField
              {...packageFieldError}
              onPackageSelected={onComparisonPointSelected}
            />
          </TestForm>
        </Router>, translationsProperties
      );
    });

    test('renders error message', () => {
      const { getByText } = renderComponent;
      expect(getByText('Please fill this in to continue')).toBeInTheDocument();
    });
  });
});
