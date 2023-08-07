import { MemoryRouter } from 'react-router-dom';

import { Accordion, renderWithIntl } from '@folio/stripes-erm-testing';
import translationsProperties from '../../../test/jest/helpers/translationsProperties';
import comparison from './testResources';
import ComparisonPoints from './ComparisonPoints';

describe('ComparisonPoints', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <ComparisonPoints
          comparison={comparison}
          id="comparisonPoints"
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the expcected accordion', async () => {
    await Accordion('Comparison points').exists();
  });

  it('renders link MR Test Agreement', () => {
    const { getByText } = renderComponent;
    expect(getByText('MR Test Agreement')).toBeInTheDocument();
  });

  it('renders link MR Test Agreement', () => {
    const { getByText } = renderComponent;
    expect(getByText('MR Test Agreement')).toBeInTheDocument();
  });
});
