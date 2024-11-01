import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

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

  test.each([
    {
      title: 'Running status',
      interactor: KeyValue('Running status'),
      hasObj: { value: 'Ended' }
    },
    {
      title: 'Outcome',
      interactor: KeyValue('Outcome'),
      hasObj: { value: 'Success' }
    },
    {
      title: 'Start date date',
      interactor: FormattedDateTime({ id: 'started-datetime' }),
      hasObj: { date: '11/14/2022' }
    },
    {
      title: 'Start date time',
      interactor: FormattedDateTime({ id: 'started-datetime' }),
      hasObj: { time: '9:30 AM' }
    },
    {
      title: 'End date date',
      interactor: FormattedDateTime({ id: 'ended-datetime' }),
      hasObj: { date: '11/14/2022' }
    },
    {
      title: 'End date time',
      interactor: FormattedDateTime({ id: 'ended-datetime' }),
      hasObj: { time: '9:44 AM' }
    },
    {
      title: 'Errors',
      interactor: KeyValue('Errors'),
      hasObj: { value: '0' }
    },
  ])('renders the expected $title', async ({ title: _t, interactor, hasObj }) => {
    await interactor.has(hasObj);
  });

  describe('clicking view comparison report button', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('View comparison report').click();
      });
    });
    it('calls onViewReport handler', async () => {
      await waitFor(() => {
        expect(onViewReportMock).toHaveBeenCalled();
      });
    });
  });
});
