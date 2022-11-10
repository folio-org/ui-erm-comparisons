import React from 'react';
import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { KeyValue, Button } from '@folio/stripes-testing';
import { StaticRouter as Router } from 'react-router-dom';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { agreementFieldData, emptyAgreementField, agreementFieldError } from './testResources';
import AgreementField from './AgreementField';

const onComparisonPointSelectedMock = jest.fn();
const onSubmit = jest.fn();

let renderComponent;
describe('AgreementField', () => {
  describe('AgreementField selected agreement', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmit}>
            <AgreementField
              {...agreementFieldData}
              onAgreementSelected={onComparisonPointSelectedMock}
            />
          </TestForm>
        </Router>, translationsProperties
      );
    });

    it('renders agreement title', () => {
      const { getByText } = renderComponent;
      expect(getByText('MR Test Agreement')).toBeInTheDocument();
    });

    test('renders a link to the agreement', async () => {
      const { getByRole } = renderComponent;
      expect(getByRole('link', { name: 'MR Test Agreement' })).toBeInTheDocument();
    });

    test('renders the Start date key value with expected value', async () => {
      await KeyValue('Start date').has({ value: '11/10/2022' });
    });

    test('renders the End date key value with expected value', async () => {
      await KeyValue('End date').has({ value: '11/30/2022' });
    });

    test('renders the Status key value with expected value', async () => {
      await KeyValue('Status').has({ value: 'Active' });
    });

    it('renders no plugin', () => {
      const { getByText } = renderComponent;
      expect(getByText('No "find-agreement" plugin is installed')).toBeInTheDocument();
    });
  });

  describe('empty AgreementField', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmit}>
            <AgreementField
              {...emptyAgreementField}
              onAgreementSelected={onComparisonPointSelectedMock}
            />
          </TestForm>
        </Router>, translationsProperties
      );
    });

    it('renders agreement title', () => {
      const { getByText } = renderComponent;
      expect(getByText('Agreement')).toBeInTheDocument();
    });

    it('renders the expected No agreement linked layout', () => {
      const { getByText } = renderComponent;
      expect(getByText('No agreement linked')).toBeInTheDocument();
    });

    it('renders the expected layout', () => {
      const { getByText } = renderComponent;
      expect(getByText('Link an agreement to get started')).toBeInTheDocument();
    });

    test('renders the submit button', async () => {
      await Button('Submit').exists();
    });
  });

  describe('AgreementField with error', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm onSubmit={onSubmit}>
            <AgreementField
              {...agreementFieldError}
              onAgreementSelected={onComparisonPointSelectedMock}
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
