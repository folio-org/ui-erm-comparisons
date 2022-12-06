
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MultiColumnList, MultiColumnListCell } from '@folio/stripes-testing';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/jest/helpers/translationsProperties';
import ComparisonReportList from './ComparisonReportList';
import sourceData from './testResources';

const totalCount = 1;
describe('ComparisonReportList', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <ComparisonReportList
          sourceData={sourceData}
        />
      </MemoryRouter>,
      translationsProperties
    );
    // screen.debug();
  });

  test('renders the comparison report MCL', async () => {
    await MultiColumnList('comparison-report-mcl').exists();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 6 }).exists();
  });

  // test('renders expected columns', async () => {
  //   await MultiColumnList({ columns: ['Title', 'Available via', 'Coverage', 'Agreement on 12/6/2022 "Active Agreement LR 002"', 'Package on 12/6/2022 "K-Int Test Package 001"', 'Overlap'] }).exists();
  // });

  test('renders expected row count', async () => {
    await MultiColumnList({ rowCount: totalCount }).exists();
  });

  // test('renders expected agreement line name in each row', async () => {
  //   Promise.all([
  //     await MultiColumnListCell({ row: 0, columnIndex: 0 }).is({ content: ' Clinical Cancer Drugs' }),
  //   ]);
  // });

  // test('renders expected Provider in each row', async () => {
  //   Promise.all([
  //     await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: 'American Chemical Society' }),
  //     await MultiColumnListCell({ row: 1, columnIndex: 1 }).has({ content: 'American Society of Civil Engineers' })
  //   ]);
  // });

  // test('renders expected Publication type date in each row', async () => {
  //   Promise.all([
  //     await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: 'Package' }),
  //     await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: 'Package' })
  //   ]);
  // });
});

