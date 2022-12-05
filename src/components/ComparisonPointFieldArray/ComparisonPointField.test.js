import { Field } from 'react-final-form';
import { StaticRouter as Router } from 'react-router-dom';

import { renderWithIntl, TestForm } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import { comparisonPointFieldPackage, comparisonPointFieldAgreement } from './testResources';

import ComparisonPointField from './ComparisonPointField';

jest.mock('./AgreementField', () => () => <div>AgreementField</div>);
jest.mock('./PackageField', () => () => <div>PackageField</div>);

const onSubmit = jest.fn();

let renderComponent;
describe('ComparisonPointField', () => {
  describe('ComparisonPointField type package', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm
            initialValues={{
              packages: [
                {
                  comparisonPoint: {
                    'id': '36e9c808-13c6-4946-b824-4fe2ad3ba860',
                    'name': 'ACM Digtal Library',
                    'count': 10650,
                    'provider': 'Association for Computing Machinery'
                  }
                }
              ]
            }}
            onSubmit={onSubmit}
          >
            <Field
              component={ComparisonPointField}
              name="packages[0].comparisonPoint"
              {...comparisonPointFieldPackage}
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
              component={ComparisonPointField}
              name="agreements[0].comparisonPoint"
              {...comparisonPointFieldAgreement}
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
