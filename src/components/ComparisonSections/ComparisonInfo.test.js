import { MemoryRouter } from 'react-router-dom';

import {
  Button,
  FormattedDateTime,
  Heading,
  KeyValue,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import comparison from './testResources';
import ComparisonInfo from './ComparisonInfo';

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

  test('renders the expcected Started date and time', async () => {
    await FormattedDateTime({ id: 'started-datetime' }).has({ date: '11/14/2022' });
    await FormattedDateTime({ id: 'started-datetime' }).has({ time: '9:30 AM' });
  });

  test('renders the expcected Ended date and time', async () => {
    await FormattedDateTime({ id: 'ended-datetime' }).has({ date: '11/14/2022' });
    await FormattedDateTime({ id: 'ended-datetime' }).has({ time: '9:30 AM' });
  });

  test('renders the expcected Errors value', async () => {
    await KeyValue('Errors').has({ value: '0' });
  });

  it('clicking the View comparison report button calls onViewReport', async () => {
    await Button('View comparison report').click();
    expect(onViewReportMock).toHaveBeenCalled();
  });
});
