import React from 'react';
import { renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import ComparisonPointFilter from './ComparisonPointFilter';

const onAgreementSelected = jest.fn();
const onPackageSelected = jest.fn();

describe('ComparisonPointFilter', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <ComparisonPointFilter
          disabled={false}
          name="comparisonPointOne"
          onAgreementSelected={onAgreementSelected}
          onPackageSelected={onPackageSelected}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the select agreement pluggin by id', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('selectAgreementPluggin')).toBeInTheDocument();
  });

  test('renders the select packages pluggin by id', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('selectPackagePluggin')).toBeInTheDocument();
  });

  test('should not call the onAgreementSelected callback', () => {
    expect(onAgreementSelected).not.toHaveBeenCalled();
  });

  test('should not call the onPackageSelected callback', () => {
    expect(onPackageSelected).not.toHaveBeenCalled();
  });
});
