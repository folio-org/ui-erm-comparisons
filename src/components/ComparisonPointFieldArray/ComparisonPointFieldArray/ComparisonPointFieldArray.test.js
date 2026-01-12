import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { StaticRouter as Router } from 'react-router-dom';
import { FieldArray } from 'react-final-form-arrays';

import {
  Button,
  Datepicker,
  IconButton,
  renderWithIntl,
  TestForm,
  Tooltip,
} from '@folio/stripes-erm-testing';

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
      deleteButtonLabel: 'Remove package 1 from comparison',
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
      deleteButtonLabel: 'Remove agreement 1 from comparison',
    },
  ])('ComparisonPointFieldArray type $type', ({
    addButtonLabel,
    deleteButtonLabel,
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

    test('Renders ComparisonPointField', () => {
      const { getAllByText } = renderComponent;
      expect(getAllByText('ComparisonPointField')).toHaveLength(1);
    });

    test(`Renders "${addButtonLabel}" button`, async () => {
      await Button(addButtonLabel).exists();
    });

    describe(`Clicking the "${addButtonLabel}" button`, () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button(addButtonLabel).click();
        });
      });

      test('renders another ComparisonPointField', () => {
        const { getAllByText } = renderComponent;
        expect(getAllByText('ComparisonPointField')).toHaveLength(2);
      });
    });

    describe('Delete button', () => {
      test('Delete button tooltip exists', async () => {
        await Tooltip(deleteButtonLabel, { proximity: true }).exists();
      });

      test('currently renders a single ComparisonPointField', () => {
        const { getAllByText } = renderComponent;
        expect(getAllByText('ComparisonPointField')).toHaveLength(1);
      });

      test('delete IconButton exists', async () => {
        await IconButton({ icon: 'trash' }).exists();
      });

      describe(`Clicking the "${deleteButtonLabel}" button`, () => {
        beforeEach(async () => {
          await IconButton({ icon: 'trash' }).click();
        });

        test('no longer renders a ComparisonPointField', () => {
          const { queryAllByText } = renderComponent;
          expect(queryAllByText('ComparisonPointField')).toHaveLength(0);
        });
      });
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
