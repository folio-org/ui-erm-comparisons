import { MemoryRouter } from 'react-router-dom';

import { MultiColumnList, MultiColumnListCell, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import entitlements from './testResources';
import EntitlementAgreementsList from './EntitlementAgreementsList';

describe('EntitlementAgreementsList', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <EntitlementAgreementsList
          entitlements={entitlements}
          id="package-agreements-list"
          visibleColumns={['name', 'status', 'startDate', 'endDate']}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders expected agreementfor the package', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('grid')).toBeInTheDocument();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 4 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({ columns: ['Name', 'Status', 'Period start', 'Period end'] }).exists();
  });

  test('renders link with the agreement name in the MCL', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('link', { name: 'MR Test Agreement' })).toBeInTheDocument();
  });

  test('renders expected status in the row', async () => {
    (await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: 'Active' }));
  });

  test('renders expected period start date in the row', async () => {
    (await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: '12/30/2022' }));
  });

  test('renders expected period end date in the row', async () => {
    (await MultiColumnListCell({ row: 0, columnIndex: 3 }).has({ content: '12/31/2022' }));
  });
});


