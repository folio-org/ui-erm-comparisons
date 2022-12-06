import React from 'react';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import ComparisonReportViewRoute from './ComparisonReportViewRoute';

const historyPushMock = jest.fn();
const historyReplaceMock = jest.fn();

const data = {
  history: {
    push: historyPushMock,
    replace: historyReplaceMock
  },
  location: {
    search: '',
    pathname: '/comparisons-erm/85f1c1f4-d619-4c07-a2f8-8163c3579bf9/report'
  },
  mutator: {
    comparisons: {
      POST: jest.fn(),
    },
    entitlementQueryParams: {
      replace: jest.fn(),
      update: jest.fn()
    },
    report: {
      DELETE: jest.fn(),
      PUT: jest.fn(),
      POST: jest.fn(),
      cancel: jest.fn(),
    },
    comparison: {
      DELETE: jest.fn(),
      PUT: jest.fn(),
      POST: jest.fn(),
      cancel: jest.fn(),
    }
  },
  resources: {
    'report': {
      'hasLoaded': true,
      'isPending': false,
      'failed': false,
      'records': [],
      'successfulMutations': [],
      'failedMutations': [],
      'pendingMutations': [],
    }
  },
  'comparison': {
    'hasLoaded': true,
    'isPending': false,
    'failed': false,
    'records': [
      '{class: "org.olf.general.jobs.ComparisonJob", compa…}'
    ],
    'successfulMutations': [],
    'failedMutations': [],
    'pendingMutations': [],
  },
};

describe('ComparisonReportViewRoute', () => {
  describe('renders the ComparisonReportViewRoute', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <ComparisonReportViewRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('displays no items in the list message', () => {
      const { getByText } = renderComponent;
      expect(getByText('The list contains no items')).toBeInTheDocument();
    });

    test('renders the comparisonReport view by id', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('comparisonReport')).toBeInTheDocument();
    });
  });
});
