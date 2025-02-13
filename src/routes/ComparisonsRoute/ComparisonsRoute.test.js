import React from 'react';

import { cleanup } from '@folio/jest-config-stripes/testing-library/react';

import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';

import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import ComparisonsRoute from './ComparisonsRoute';

const historyPushMock = jest.fn();

jest.mock('../../components/ComparisonFilters/ComparisonFilters', () => () => <div>ComparisonFilters</div>);

const data = {
  history: {
    push: historyPushMock,
  },
  location: {
    pathname: '/comparisons-erm/85f1c1f4-d619-4c07-a2f8-8163c3579bf9',
    search: ''
  },
  match: {
    params: { id: '85f1c1f4-d619-4c07-a2f8-8163c3579bf9' }
  },
};

describe('ComparisonsRoute', () => {
  let renderComponent;
  describe('renders the route', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <ComparisonsRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders Comparisons view by id', () => {
      const { getByTestId } = renderComponent;
      expect(getByTestId('comparisons')).toBeInTheDocument();
    });

    describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
      beforeEach(() => {
        // Using this to clean up the render component prior to rerender
        cleanup();

        renderWithIntl(
          <MemoryRouter>
            <ComparisonsRoute {...data} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the comparisons component', () => {
        const { getByTestId } = renderComponent;
        expect(getByTestId('comparisons')).toBeInTheDocument();
      });
    });
  });
});
