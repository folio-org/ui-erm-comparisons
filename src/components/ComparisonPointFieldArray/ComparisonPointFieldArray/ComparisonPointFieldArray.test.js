import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { StaticRouter as Router } from 'react-router-dom';
import { FieldArray } from 'react-final-form-arrays';

import { Button, Datepicker, renderWithIntl, TestForm } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/jest/helpers/translationsProperties';

import ComparisonPointFieldArray from './ComparisonPointFieldArray';

jest.mock('../ComparisonPointField', () => () => <div>ComparisonPointField</div>);

const onSubmit = jest.fn();

// It would be nice if the package/agreement data came from centralised test resources, but those aren't often shared between modules atm
// I have split out the "packageToComparisonPoint" etc functions for this purpose though

let renderComponent;
describe('ComparisonPointFieldArray', () => {
  describe.each([
    {
      initialValues: {
        packages: [
          {
            onDate: '2022-11-10T00:00:00.000Z',
            comparisonPoint: {
              id: '810dfe8a-df91-4a7f-9200-00655620828a',
              name: 'ACM Digtal Library',
              count: 10650,
              provider: 'Association for Computing Machinery'
            }
          }
        ]
      },
      fieldName: 'packages',
      props: {
        addLabelId: 'ui-erm-comparisons.newComparison.addPackage',
        comparisonPoint: 'package',
        deleteButtonTooltipId: 'ui-erm-comparisons.newComparison.removePackage',
        headerId: 'ui-erm-comparisons.newComparison.packageTitle',
        id: 'comparison-point-form-packages'
      },
      type: 'package',
      addButtonLabel: 'Add package',
    },
    {
      initialValues: {
        agreements: [
          {
            onDate: '2022-11-10T00:00:00.000Z',
            comparisonPoint: {
              id: 'd4f602ec-4ec4-4a22-be94-07e2c04f733b',
              name: 'MR Test',
              startDate: '2022-11-03',
              status: 'Active',
              endDate: '2022-11-25'
            }
          }
        ]
      },
      fieldName: 'agreements',
      props: {
        addLabelId: 'ui-erm-comparisons.newComparison.addAgreement',
        comparisonPoint: 'agreement',
        deleteButtonTooltipId: 'ui-erm-comparisons.newComparison.removeAgreement',
        headerId: 'ui-erm-comparisons.newComparison.agreementTitle',
        id: 'comparison-point-form-agreements'
      },
      type: 'agreement',
      addButtonLabel: 'Add agreement',
    },
  ])('ComparisonPointFieldArray type $type', ({
    addButtonLabel,
    initialValues,
    fieldName,
    props
  }) => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <Router>
          <TestForm
            initialValues={initialValues}
            onSubmit={onSubmit}
          >
            <FieldArray
              component={ComparisonPointFieldArray}
              name={fieldName}
              {...props}
            />
          </TestForm>
        </Router>, translationsProperties
      );
    });

    test(`Renders "${addButtonLabel}" button`, async () => {
      await Button(addButtonLabel).exists();
    });

    test('Renders the "On date" date field', async () => {
      await Datepicker('On date*').exists();
    });

    describe('filling in the datepicker', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Datepicker('On date*').fillIn('02/03/1999');
        });
      });

      test('Datepicker shows correct value', async () => {
        await waitFor(async () => {
          await Datepicker('On date*').has({ inputValue: '02/03/1999' });
        });
      });
    });
  });
});
