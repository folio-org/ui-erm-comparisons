import React from 'react';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { StaticRouter as Router } from 'react-router-dom';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { comparisonPointFieldPackage, comparisonPointFieldAgreement } from './testResources';
import ComparisonPointField from './ComparisonPointField';

jest.mock('./AgreementField', () => () => <div>AgreementField</div>);
jest.mock('./PackageField', () => () => <div>PackageField</div>);

const onComparisonPointSelectedMock = jest.fn();
const onSubmit = jest.fn();

let renderComponent;
describe('ComparisonPointField', () => {
  describe('ComparisonPointField type package', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmit}>
            <ComparisonPointField
              {...comparisonPointFieldPackage}
              onComparisonPointSelected={onComparisonPointSelectedMock}
            />
          </TestForm>
        </Router>, translationsProperties
      );
    });

    it('renders PackageField component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageField')).toBeInTheDocument();
    });
  });

  describe('ComparisonPointField type agreement', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmit}>
            <ComparisonPointField
              {...comparisonPointFieldAgreement}
              onComparisonPointSelected={onComparisonPointSelectedMock}
            />
          </TestForm>
        </Router>, translationsProperties
      );
    });

    it('renders AgreementField component', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementField')).toBeInTheDocument();
    });
  });
});
