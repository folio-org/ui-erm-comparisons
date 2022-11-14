import React from 'react';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { KeyValue, Heading, Button } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import comparison from './testResources';
import ComparisonInfo from './ComparisonInfo';

jest.mock('../FormattedDateTime', () => () => <div>FormattedDateTime</div>);
const onViewReportMock = jest.fn();

describe('ComparisonInfo', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <ComparisonInfo
          comparison={comparison}
          onViewReport={onViewReportMock}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the expcected heading', async () => {
    await Heading('test').exists();
  });

  test('renders the expcected Running status value', async () => {
    await KeyValue('Running status').has({ value: 'Ended' });
  });

  test('renders the expcected Outcome value', async () => {
    await KeyValue('Outcome').has({ value: 'Success' });
  });

  test('renders the expcected Started date', async () => {
    await KeyValue('Started').has({ value: 'FormattedDateTime' });
  });

  test('renders the expcected Ended date', async () => {
    await KeyValue('Ended').has({ value: 'FormattedDateTime' });
  });

  test('renders the expcected Errors value', async () => {
    await KeyValue('Errors').has({ value: '0' });
  });

  it('clicking the View comparison report button calls onViewReport', async () => {
    await Button('View comparison report').click();
    expect(onViewReportMock).toHaveBeenCalled();
  });
});
