import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { Button as MockStripesButton } from '@folio/stripes/components';
import { Button as ButtonInteractor, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import ComparisonCreateRoute from './ComparisonCreateRoute';

const historyPushMock = jest.fn();
const historyReplaceMock = jest.fn();

jest.mock('../../components/views/ComparisonForm', () => {
  return (props) => (
    <div>
      <div>ComparisonForm</div>
      <MockStripesButton onClick={props.handlers.onClose}>CloseButton</MockStripesButton>
    </div>
  );
});

const data = {
  history: {
    push: historyPushMock,
    replace: historyReplaceMock
  },
  location: {
    search: ''
  },
  mutator: {
    comparisons: {
      POST: jest.fn(),
    },
    entitlementQueryParams: {
      replace: jest.fn(),
      update: jest.fn()
    }
  },
  resources: {
    entitlements: {
      hasLoaded: false,
      isPending: false,
      failed: false,
      records: [],
      successfulMutations: [],
      failedMutations: [],
      pendingMutations: []
    },
    entitlementQueryParams: {
      entitlementsCount: 100
    },
    comparisons: {
      hasLoaded: false,
      isPending: false,
      failed: false,
      records: [],
      successfulMutations: [],
      failedMutations: [],
      pendingMutations: []
    }
  }
};

describe('ComparisonCreateRoute', () => {
  describe('rendering the route', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <ComparisonCreateRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the comparisonForm component', () => {
      const { getByText } = renderComponent;
      expect(getByText('ComparisonForm')).toBeInTheDocument();
    });

    describe('clicking the CloseButton', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await ButtonInteractor('CloseButton').click();
        });
      });
      // we check if the button is clicked it calls the historyPushMock(push) function to invoke the child callback (handleClose) defined in Route
      test('calls history.push', async () => {
        await waitFor(() => {
          expect(historyPushMock).toHaveBeenCalled();
        });
      });
    });
  });
});
