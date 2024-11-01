import { Field } from 'react-final-form';
import { StaticRouter as Router } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { requiredValidator } from '@folio/stripes-erm-components';
import {
  Button,
  KeyValue,
  renderWithIntl,
  TestForm
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { agreementFieldData } from './testResources';

import AgreementField from './AgreementField';

const onSubmit = jest.fn();

let renderComponent;
describe('AgreementField', () => {
  describe('selected agreement', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm
            initialValues={{
              agreements: [
                {
                  comparisonPoint: {
                    'id': 'c2ef50e0-c64f-437b-b3b8-82909505f2a3',
                    'name': 'MR Test Agreement',
                    'startDate': '2022-11-10',
                    'status': 'Active',
                    'endDate': '2022-11-30'
                  }
                }
              ]
            }}
            onSubmit={onSubmit}
          >
            <Field
              component={AgreementField}
              name="agreements[0].comparisonPoint"
              validate={requiredValidator}
              {...agreementFieldData}
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
          <TestForm
            initialValues={{
              agreements: [{
                comparisonPoint: null
              }]
            }}
            onSubmit={onSubmit}
          >
            <Field
              component={AgreementField}
              name="agreements[0].comparisonPoint"
              validate={requiredValidator}
              {...agreementFieldData}
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

    describe('attempting to submit', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('Submit').click();
        });
      });
      it('displays an error', async () => {
        const { getByText } = renderComponent;
        await waitFor(() => {
          expect(getByText('Please fill this in to continue')).toBeInTheDocument();
        });
      });
    });
  });
});
