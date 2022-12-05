import { FieldArray } from 'react-final-form-arrays';

import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';
import { StaticRouter as Router } from 'react-router-dom';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { comparisonPointFieldArrayPackage, comparisonPointFieldArrayAgreement } from './testResources';

import ComparisonPointFieldArray from './ComparisonPointFieldArray';

jest.mock('./ComparisonPointField', () => () => <div>ComparisonPointField</div>);

const onSubmit = jest.fn();

let renderComponent;
describe('ComparisonPointFieldArray', () => {
  describe('ComparisonPointFieldArray type package', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm
            initialValues={{
              packages: [
                {
                  '_delete': false,
                  'onDate': '2022-11-10T00:00:00.000Z',
                  'comparisonPoint': {
                    'id': '810dfe8a-df91-4a7f-9200-00655620828a',
                    'name': 'ACM Digtal Library',
                    'count': 10650,
                    'provider': 'Association for Computing Machinery'
                  }
                }
              ]
            }}
            onSubmit={onSubmit}
          >
            <FieldArray
              component={ComparisonPointFieldArray}
              name="packages"
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
          <TestForm
            initialValues={{
              agreements: [
                {
                  '_delete': false,
                  'onDate': '2022-11-10T00:00:00.000Z',
                  'comparisonPoint': {
                    'id': 'd4f602ec-4ec4-4a22-be94-07e2c04f733b',
                    'name': 'MR Test',
                    'startDate': '2022-11-03',
                    'status': 'Active',
                    'endDate': '2022-11-25'
                  }
                }
              ]
            }}
            onSubmit={onSubmit}
          >
            <FieldArray
              component={ComparisonPointFieldArray}
              name="agreements"
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
