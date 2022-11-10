import React from 'react';
import { renderWithIntl, TestForm, mockKintComponents } from '@folio/stripes-erm-testing';
import { StaticRouter as Router } from 'react-router-dom';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { comparisonPointFieldArrayPackage, comparisonPointFieldArrayAgreement } from './testResources';
import ComparisonPointFieldArray from './ComparisonPointFieldArray';

jest.mock('./ComparisonPointField', () => () => <div>ComparisonPointField</div>);

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  ...mockKintComponents
}));

const onSubmit = jest.fn();

let renderComponent;
describe('ComparisonPointFieldArray', () => {
  describe('ComparisonPointFieldArray type package', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmit}>
            <ComparisonPointFieldArray
              {...comparisonPointFieldArrayPackage}
            />
          </TestForm>
        </Router>, translationsProperties
      );
    });
    test('renders the Add package button', async () => {
      const { getByRole } = renderComponent;
      expect(getByRole('button', { name: 'Add package' })).toBeInTheDocument();
    });
  });

  describe('ComparisonPointFieldArray type agreement', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmit}>
            <ComparisonPointFieldArray
              {...comparisonPointFieldArrayAgreement}
            />
          </TestForm>
        </Router>, translationsProperties
      );
    });

    test('renders the Add package button', async () => {
      const { getByRole } = renderComponent;
      expect(getByRole('button', { name: 'Add agreement' })).toBeInTheDocument();
    });
  });
});
