import React from 'react';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Pane, PaneHeader, MultiColumnList } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/jest/helpers/translationsProperties';

import { data, source } from './testResources';
import Comparisons from './Comparisons';

const onNeedMoreData = jest.fn();
const queryGetter = jest.fn();
const querySetter = jest.fn();

describe('Comparisons', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <Comparisons
          data={data}
          onNeedMoreData={onNeedMoreData}
          queryGetter={queryGetter}
          querySetter={querySetter}
          source={source}
          visibleColumns={['comparisonName', 'runningStatus', 'result', 'errors', 'started', 'ended']}
        />
      </MemoryRouter>,
      translationsProperties
    );

    const { getByRole } = renderComponent;
    expect(getByRole('grid')).toBeInTheDocument();
  });

  test('renders the expected Search and Filter Pane header', async () => {
    await Pane('Search and filter').is({ visible: true });
  });

  test('renders expected search box for SAS', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('searchbox', { name: 'Search comparisons' })).toBeInTheDocument();
  });

  test('renders the expected ERM comparisons Pane', async () => {
    await Pane('ERM comparisons').is({ visible: true });
  });

  test('displays the ERM comparisons pane header', async () => {
    await PaneHeader('ERM comparisons').is({ visible: true });
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 6 }).exists();
  });

  test('renders expected columns', async () => {
    await MultiColumnList({ columns: ['Name', 'Running status', 'Outcome', 'Errors', 'Started', 'Ended'] }).exists();
  });

  test('renders the expcted number of MCL rows', async () => {
    await MultiColumnList({ rowCount: 4 }).exists();
  });
});
