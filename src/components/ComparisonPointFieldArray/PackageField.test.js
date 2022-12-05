import { Field } from 'react-final-form';
import { StaticRouter as Router } from 'react-router-dom';

import { requiredValidator } from '@folio/stripes-erm-components';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { KeyValue } from '@folio/stripes-testing';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { packageFieldData } from './testResources';

import PackageField from './PackageField';

const onSubmit = jest.fn();

// EXAMPLE this is a quick and dirty way to mock the Registry, we may need to implement this into __mocks__ folder at some point
jest.mock('@folio/handler-stripes-registry', () => ({
  Registry: {
    getResource: () => ({ getViewResource: () => () => 'some-link-value' })
  }
}));

let renderComponent;
describe('PackageField', () => {
  describe('PackageField selected agreement', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm
            initialValues={{
              packages: [{
                comparisonPoint: {
                  'id': '810dfe8a-df91-4a7f-9200-00655620828a',
                  'name': 'ACM Digtal Library',
                  'count': 10650,
                  'provider': 'Association for Computing Machinery'
                }
              }]
            }}
            onSubmit={onSubmit}
          >
            <Field
              component={PackageField}
              name="packages[0].comparisonPoint"
              validate={requiredValidator}
              {...packageFieldData}
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
          <TestForm
            initialValues={{
              packages: [{
                comparisonPoint: null
              }]
            }}
            onSubmit={onSubmit}
          >
            <Field
              component={PackageField}
              name="packages[0].comparisonPoint"
              validate={requiredValidator}
              {...packageFieldData}
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

    it('displays an error', async () => {
      const { getByText } = renderComponent;
      expect(getByText('Please fill this in to continue')).toBeInTheDocument();
    });
  });
});
