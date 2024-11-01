import { MemoryRouter } from 'react-router-dom';
import mockGet from 'lodash/get';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { Button as MockStripesButton } from '@folio/stripes/components';
import {
  Button,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import ComparisonViewRoute from './ComparisonViewRoute';


const historyPushMock = jest.fn();

const mockButtons = [
  // TODO the handler situation here is annoying, where only the export lives in handlers... might need a refactor
  // TODO We'd need to mock useQuery specifically to test this export behaves as we expect
  { buttonLabel: 'ExportReportAsJSONButton', propKey: 'handlers.onExportReportAsJSON' },
  { buttonLabel: 'CloseButton', propKey: 'onClose', callback: historyPushMock, expectedCalledWith: '/comparisons-erm' },
  // TODO extra work can be done here to check that the delete opens modal, and that clicking confirm/cancel will close it again
  // Confirm should also trigger the delete mutation, we could mock and catch that too.
  { buttonLabel: 'DeleteButton', propKey: 'onDelete' },
  { buttonLabel: 'ViewReportButton', propKey: 'onViewReport', callback: historyPushMock, expectedCalledWith: '/comparisons-erm/85f1c1f4-d619-4c07-a2f8-8163c3579bf9/report' },
];

jest.mock('../../components/views/ComparisonView', () => {
  return (props) => (
    <>
      ComparisonView
      {mockButtons.map(({ buttonLabel, propKey }) => (
        <MockStripesButton
          key={`button-key-${buttonLabel}`}
          onClick={mockGet(props, propKey)}
        >
          {buttonLabel}
        </MockStripesButton>
      ))}
    </>
  );
});

const data = {
  history: {
    push: historyPushMock,
  },
  location: {
    pathname: '/comparisons-erm/85f1c1f4-d619-4c07-a2f8-8163c3579bf9',
    search: ''
  },
  match: {
    params: {
      id: '85f1c1f4-d619-4c07-a2f8-8163c3579bf9'
    },
  }
};

describe('ComparisonViewRoute', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <ComparisonViewRoute {...data} />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders ComparisonView component', () => {
    const { getByText } = renderComponent;
    expect(getByText('ComparisonView')).toBeInTheDocument();
  });

  describe.each(mockButtons)('testing $buttonLabel', ({ buttonLabel, callback, expectedCalledWith }) => {
    beforeEach(() => {
      // Ensure fresh mocks for each test
      historyPushMock.mockClear();
    });

    test(`renders the ${buttonLabel}`, async () => {
      await Button(buttonLabel).exists();
    });

    if (callback) {
      describe(`clicking ${buttonLabel}`, () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await Button(buttonLabel).click();
          });
        });

        test(`callback for ${buttonLabel} is as expected`, async () => {
          await waitFor(() => {
            expect(callback.mock.calls[0][0]).toEqual(expectedCalledWith);
          });
        });
      });
    }
  });
});
